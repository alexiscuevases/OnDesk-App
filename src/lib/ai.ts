import { createClient } from "./supabase/server";
import { Agent } from "./validations/agent";
import { Conversation } from "./validations/conversation";
import { Message } from "./validations/message";
import { Endpoint } from "./validations/endpoint";
import { generateText } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
if (!DEEPSEEK_API_KEY) throw new Error("Please define all AI environment variables");

export class AI {
	/**
	 * Generar respuesta
	 */
	async generateResponse(conversationId: string) {
		try {
			const supabase = await createClient();

			// Obtener conversación
			const { data: conversation, error: conversationError } = await supabase
				.from("conversations")
				.select("*, agents:agent_id(*)")
				.eq("id", conversationId)
				.single<Conversation>();
			if (conversationError) throw conversationError;

			// Verificar agente asignado
			const agent = conversation.agents as Agent;
			if (!agent) throw new Error("No agent assigned to conversation");
			if (agent.status !== "active") throw new Error("Agent is not active");

			// Obtener historial de conversación (Últimos 20 mensajes)
			const { data: messages, error: messagesError } = await supabase
				.from("messages")
				.select("*")
				.eq("conversation_id", conversationId)
				.order("created_at", { ascending: true })
				.limit(20)
				.returns<Message[]>();
			if (messagesError) throw messagesError;

			// Obtener endpoints del agente
			const { data: endpoints, error: endpointsError } = await supabase
				.from("endpoints")
				.select("*")
				.eq("agent_id", agent.id)
				.eq("is_active", true)
				.returns<Endpoint[]>();
			if (endpointsError) throw endpointsError;

			// Construir las acciones del agente
			const actionsDescription =
				endpoints && endpoints.length > 0
					? `
						====== INICIO | ACCIONES DISPONIBLES ======
						Tienes acceso a las siguientes acciones para ayudar al usuario.
						Cuando necesites usar una, responde EXACTAMENTE en este formato (IGNORA los parentesis, son instrucciones para tí):
						[USE_ACTION: id_de_la_acción] (OBLIGATORIO, siempre)
						[PARAMETERS: {"param1": "value", "param2": "value"}] (OBLIGATORIO, si hay parametros requeridos)

						Lista de Acciones:
						${endpoints
							.map(
								(endpoint) => `
									- ${endpoint.name}: ${endpoint.description}
									ID: ${endpoint.id}
									${Object.keys(endpoint.params_schema).length > 0 ? `Parámetros requeridos:: ${JSON.stringify(endpoint.params_schema)}` : ""}
								`
							)
							.join("\n")}
						====== FINAL | ACCIONES DISPONIBLES ======
					`
					: "";

			// Construir mensajes para la IA
			const messagesForAI = [
				{
					role: "system",
					content: `
						====== START | SYSTEM PROMPT ======
						${agent.system_prompt}
						====== END | SYSTEM PROMPT ======

						${actionsDescription}

						====== START | Información del cliente ======
						- Nombre: ${conversation.customer_name || "No proporcionado"}
						- Email: ${conversation.customer_email || "No proporcionado"}
						- Teléfono: ${conversation.customer_phone || "No proporcionado"}
						====== END | Información del cliente ======

						====== START | Información de la conversación ======
						- Canal: ${conversation.channel}
						- Prioridad: ${conversation.priority}
						====== END | Información de la conversación ======

						====== START | IMPORTANTE ======
						- LIMÍTATE a responder al último mensaje del usuario de manera profesional y sútil (utiliza el resto de mensajes para alimentarte).
						- LIMÍTATE al comportamiento descrito en la sección =SYSTEM PROMPT=.
						- Si necesitas ejecutar una acción, en la respuesta utiliza el formato exacto especificado arriba con el ID de la acción.
						- NUNCA inventes o modifiques los IDs de las acciones.
						- NUNCA inventes o modifiques el formato especificado para las respuestas de las acciones.
						- SIEMPRE y EN TODO MOMENTO lo descrito en el =SYSTEM PROMPT= tendrá mas prioridad que las acciones.
						- NUNCA lo descrito en =SYSTEM PROMPT= tendrá mas prioridad que 'Información de la conversación' o 'Información del cliente'.
						====== END | IMPORTANTE ======
					`,
				},
				...(messages?.map((message) => {
					let message_role;
					switch (message.role) {
						case "system":
							message_role = "system";
							break;
						case "agent":
							message_role = "assistant";
							break;
						case "user":
							message_role = "user";
							break;
					}

					return {
						role: message_role,
						content: message.content,
					};
				}) ?? []),
			];

			// Crear conexión con DeepSeek
			const deepseek = createDeepSeek({
				apiKey: DEEPSEEK_API_KEY,
			});

			// Primera llamada a la IA para detectar si el uso de una acción es requerida
			const { text: initialResponse } = await generateText({
				model: deepseek("deepseek-chat"),
				messages: messagesForAI,
				maxOutputTokens: agent.max_tokens,
				temperature: agent.temperature,
			});

			// Comprobar si la IA requiere el uso de una acción
			const actionMatch = this.parseActionUsage(initialResponse);
			if (actionMatch && endpoints) {
				// Filtrar el endpoint
				const endpoint = endpoints.find((endpoint) => endpoint.id === actionMatch.id);
				if (endpoint) {
					// Ejecutar el endpoint
					const actionResult = await this.actionExecutor(actionMatch.id, actionMatch.parameters);

					// Agregar el resultado de la ejecución de la acción al contexto de la IA
					messagesForAI.push({
						role: "assistant",
						content: initialResponse,
					});

					messagesForAI.push({
						role: "system",
						content: `
							====== START | RESULTADO DE LA ACCIÓN "${endpoint.name}" ======
							${actionResult.success ? `✓ Éxito (${actionResult.duration}ms) Respuesta: ${JSON.stringify(actionResult.data, null, 2)}` : `✗ Error: ${actionResult.error}`}

							- Ahora responde al usuario basándote en este resultado.
							- NO repitas el formato del resultado, solo proporciona una respuesta natural y útil.
							====== END | RESULTADO DE LA ACCIÓN ======
						`,
					});

					// Generar respuesta final con el resultado de la acción.
					const { text: finalResponse } = await generateText({
						model: deepseek("deepseek-chat"),
						messages: messagesForAI,
						maxOutputTokens: agent.max_tokens,
						temperature: agent.temperature,
					});

					return { success: true, message: finalResponse };
				}
			}

			// Si no se requiere ejecutar alguna acción o no se encontró, retornar la respuesta inicial
			return { success: true, message: initialResponse };
		} catch (err: unknown) {
			if (err instanceof Error) return { success: false, error: err.message };
			return { success: false, error: "Unexpected error occurred generating AI response" };
		}
	}

	/**
	 * Parse action usage from AI response
	 */
	private parseActionUsage(response: string) {
		// Hacer coincidir el formato de uso de la acción
		const actionRegex = /\[USE_ACTION:\s*([^\]]+)\]/i;
		const paramsRegex = /\[PARAMETERS:\s*(\{[^}]*\})\]/is;

		const actionMatch = response.match(actionRegex);
		const paramsMatch = response.match(paramsRegex);

		if (actionMatch && actionMatch[1]) {
			let parameters: Record<string, any> = {};

			// Try to parse parameters if present
			if (paramsMatch && paramsMatch[1]) {
				try {
					parameters = JSON.parse(paramsMatch[1]);
				} catch (e: unknown) {
					// Try to extract parameters manually
					parameters = this.extractParametersManually(paramsMatch[1]);
				}
			}

			return {
				id: actionMatch[1].trim(),
				parameters,
			};
		}

		return null;
	}

	/**
	 * Extract parameters manually if JSON.parse fails
	 */
	private extractParametersManually(paramsString: string) {
		const parameters: Record<string, any> = {};

		try {
			// Remove brackets and whitespace
			const cleaned = paramsString.replace(/[{}]/g, "").trim();

			// Split by comma but respect quotes
			const pairs = cleaned.match(/(?:[^,"]|"[^"]*")+/g) || [];
			for (const pair of pairs) {
				const colonIndex = pair.indexOf(":");
				if (colonIndex > 0) {
					const key = pair.substring(0, colonIndex).trim().replace(/"/g, "");
					let value = pair
						.substring(colonIndex + 1)
						.trim()
						.replace(/"/g, "");

					// Try to parse as number
					if (!isNaN(Number(value))) parameters[key] = Number(value);
					else if (value === "true" || value === "false") parameters[key] = value === "true";
					else parameters[key] = value;
				}
			}
		} catch (err: unknown) {
			// None
		}

		return parameters;
	}

	/**
	 *
	 */
	async actionExecutor(endpointId: string, params: Record<string, any> = {}) {
		const supabase = await createClient();

		const { data: endpoint, error: endpointError } = await supabase.from("endpoints").select("*").eq("id", endpointId).single<Endpoint>();
		if (endpointError) throw endpointError;

		const start = Date.now();

		try {
			// Construir la URL con parámetros (para GET, DELETE)
			let url = endpoint.url;
			url = url.replace(/\{(\w+)\}/g, (_, key) => {
				const value = params[key];
				delete params[key];
				return encodeURIComponent(value ?? "");
			});

			if (["GET", "DELETE"].includes(endpoint.method.toUpperCase())) {
				const query = new URLSearchParams(params).toString();
				if (query) url += (url.includes("?") ? "&" : "?") + query;
			}

			// Preparar body (para POST, PUT, PATCH)
			const body = ["POST", "PUT", "PATCH"].includes(endpoint.method.toUpperCase()) ? JSON.stringify(params) : undefined;
			const response = await fetch(url, {
				method: endpoint.method,
				headers: {
					"Content-Type": "application/json",
					...endpoint.headers_schema,
				},
				body,
			});
			if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

			const data = await response.json().catch(() => ({}));
			const duration = Date.now() - start;

			return {
				success: true,
				data,
				duration,
			};
		} catch (err: unknown) {
			const duration = Date.now() - start;
			if (err instanceof Error) return { success: false, error: err.message, duration };
			return { success: false, error: "Unexpected error occurred executing AI action", duration };
		}
	}
}

export const ai = new AI();
