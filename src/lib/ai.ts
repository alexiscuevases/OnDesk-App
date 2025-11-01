import { createClient } from "./supabase/server";
import { Agent } from "./validations/agent";
import { Conversation } from "./validations/conversation";
import { Message } from "./validations/message";
import { Endpoint } from "./validations/endpoint";
import { generateText } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";

export class AI {
	async generateAgentResponse(conversationId: string) {
		try {
			const supabase = await createClient();

			const { data: conversation, error: conversationError } = await supabase
				.from("conversations")
				.select("*, agents:agent_id(*)")
				.eq("id", conversationId)
				.single<Conversation>();
			if (conversationError) throw conversationError;

			const agent = conversation.agents as Agent;
			if (!agent) return new Error("No agent assigned to conversation");
			if (agent.status !== "active") return new Error("Agent is not active");

			// Get conversation history (last 20 messages)
			const { data: messages, error: messagesError } = await supabase
				.from("messages")
				.select("*")
				.eq("conversation_id", conversationId)
				.order("created_at", { ascending: true })
				.limit(20)
				.returns<Message[]>();
			if (messagesError) throw messagesError;

			// Get agent's active endpoints
			const { data: endpoints, error: endpointsError } = await supabase
				.from("endpoints")
				.select("*")
				.eq("agent_id", agent.id)
				.eq("is_active", true)
				.returns<Endpoint[]>();
			if (endpointsError) throw endpointsError;

			const deepseek = createDeepSeek({
				apiKey: process.env.DEEPSEEK_API_KEY ?? "",
			});

			// Build tools description for the system prompt
			const toolsDescription =
				endpoints && endpoints.length > 0
					? `
						HERRAMIENTAS DISPONIBLES:
						Tienes acceso a las siguientes herramientas para ayudar al usuario.
						Cuando necesites usar una, responde EXACTAMENTE en este formato:
						[USAR_HERRAMIENTA: id_de_la_herramienta]
						[PARAMETROS: {"param1": "valor1", "param2": "valor2"}]

						Lista de Herramientas:
						${endpoints
							.map(
								(e) => `
								- ${e.name}: ${e.description}
								ID: ${e.id}
								Método: ${e.method}
								URL: ${e.url}
								Parámetros requeridos: ${JSON.stringify(e.params_schema)}
								${Object.keys(e.body_schema).length > 0 ? `Body requerido: ${JSON.stringify(e.body_schema)}` : ""}`
							)
							.join("\n")}
					`
					: "";

			const messagesForAI = [
				{
					role: "system" as const,
					content: `
						SYSTEM PROMPT:
						${agent.system_prompt}

						${toolsDescription}

						Información del cliente:
						- Nombre: ${conversation.customer_name || "No proporcionado"}
						- Email: ${conversation.customer_email || "No proporcionado"}
						- Teléfono: ${conversation.customer_phone || "No proporcionado"}

						Información de la conversación:
						- Canal: ${conversation.channel}
						- Prioridad: ${conversation.priority}

						IMPORTANTE:
						- Limítate a responder al último mensaje del usuario de manera profesional y sútil (utiliza el resto para alimentarte).
						- Limítate al comportamiento descrito en el SYSTEM PROMPT.
						- Si necesitas usar una herramienta, usa el formato exacto especificado arriba con el ID de la herramienta.
						- NUNCA inventes o modifiques los IDs de las herramientas.
						- NUNCA inventes o modifiques el formato especificado para las herramientas.
					`,
				},
				...(messages?.map((msg) => ({
					role: msg.role === "agent" ? "assistant" : msg.role === "user" ? "user" : "system",
					content: msg.content,
				})) ?? []),
			];

			// First AI call to detect if tool usage is needed
			const { text: initialResponse } = await generateText({
				model: deepseek("deepseek-chat"),
				messages: messagesForAI,
				maxOutputTokens: agent.max_tokens,
				temperature: agent.temperature,
			});

			// Check if AI wants to use a tool
			const toolMatch = this.parseToolUsage(initialResponse);
			if (toolMatch && endpoints) {
				// Find the endpoint by ID
				const endpoint = endpoints.find((e) => e.id === toolMatch.id);
				console.log(endpoint);
				if (endpoint) {
					// Execute the endpoint
					const executionResult = await this.endpointExecutor(toolMatch.id, toolMatch.parameters);

					// Add tool execution result to context
					messagesForAI.push({
						role: "assistant" as const,
						content: initialResponse,
					});

					messagesForAI.push({
						role: "system" as const,
						content: `
							RESULTADO DE LA HERRAMIENTA "${endpoint.name}":
							${
								executionResult.success
									? `✓ Éxito (${executionResult.duration}ms) Respuesta: ${JSON.stringify(executionResult.data, null, 2)}`
									: `✗ Error: ${executionResult.error}`
							}

							Ahora responde al usuario basándote en este resultado.
							NO repitas el formato de herramienta, solo proporciona una respuesta natural y útil.
						`,
					});

					// Generate final response with tool result
					const { text: finalResponse } = await generateText({
						model: deepseek("deepseek-chat"),
						messages: messagesForAI,
						maxOutputTokens: agent.max_tokens,
						temperature: agent.temperature,
					});

					return finalResponse;
				}
			}

			// If no tool usage detected or tool not found, return initial response
			return initialResponse;
		} catch (err: any) {
			throw err;
		}
	}

	/**
	 * Parse tool usage from AI response
	 */
	private parseToolUsage(response: string): { id: string; parameters: Record<string, any> } | null {
		// Match the tool usage format
		const toolRegex = /\[USAR_HERRAMIENTA:\s*([^\]]+)\]/i;
		const paramsRegex = /\[PARAMETROS:\s*(\{[^}]*\})\]/is;

		const toolMatch = response.match(toolRegex);
		const paramsMatch = response.match(paramsRegex);

		if (toolMatch && toolMatch[1]) {
			let parameters: Record<string, any> = {};

			// Try to parse parameters if present
			if (paramsMatch && paramsMatch[1]) {
				try {
					parameters = JSON.parse(paramsMatch[1]);
				} catch (e) {
					console.error("Failed to parse tool parameters:", e);
					// Try to extract parameters manually
					parameters = this.extractParametersManually(paramsMatch[1]);
				}
			}

			return {
				id: toolMatch[1].trim(),
				parameters,
			};
		}

		return null;
	}

	/**
	 * Extract parameters manually if JSON.parse fails
	 */
	private extractParametersManually(paramsString: string): Record<string, any> {
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
					if (!isNaN(Number(value))) {
						parameters[key] = Number(value);
					} else if (value === "true" || value === "false") {
						parameters[key] = value === "true";
					} else {
						parameters[key] = value;
					}
				}
			}
		} catch (e) {
			console.error("Manual parameter extraction failed:", e);
		}

		return parameters;
	}

	/**
	 *
	 */
	async endpointExecutor(endpointId: string, params: Record<string, any> = {}) {
		const supabase = await createClient();

		const { data: endpoint, error } = await supabase.from("endpoints").select("*").eq("id", endpointId).single<Endpoint>();
		if (error || !endpoint) {
			return {
				success: false,
				error: error?.message || "Endpoint no encontrado",
				duration: 0,
			};
		}

		const start = Date.now();

		try {
			// Construir la URL con parámetros (para GET, DELETE)
			let url = endpoint.url;
			if (["GET", "DELETE"].includes(endpoint.method.toUpperCase())) {
				const query = new URLSearchParams(params).toString();
				if (query) url += (url.includes("?") ? "&" : "?") + query;
			}

			// Preparar body (para POST, PUT, PATCH)
			const body = ["POST", "PUT", "PATCH"].includes(endpoint.method.toUpperCase()) ? JSON.stringify(params) : undefined;

			const res = await fetch(url, {
				method: endpoint.method,
				headers: {
					"Content-Type": "application/json",
				},
				body,
			});

			const duration = Date.now() - start;

			if (!res.ok) {
				return {
					success: false,
					error: `HTTP ${res.status}: ${res.statusText}`,
					duration,
				};
			}

			const data = await res.json().catch(() => ({}));

			return {
				success: true,
				data,
				duration,
			};
		} catch (err: any) {
			const duration = Date.now() - start;
			return {
				success: false,
				error: err.message || "Error desconocido ejecutando el endpoint",
				duration,
			};
		}
	}
}

export const ai = new AI();
