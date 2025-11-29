import { supabaseAdmin } from "../supabase/admin";
import { Conversation } from "../validations/conversation";
import { Message } from "../validations/message";
import { Endpoint } from "../validations/endpoint";
import { generateText } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { endpoints as Endpoints_Service } from "./endpoints";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
if (!DEEPSEEK_API_KEY) throw new Error("Please define all AI environment variables");

export interface MessageForAI {
	role: "system" | "assistant" | "user";
	content: string;
}

export class AI {
	/**
	 * Generar respuesta
	 */
	async generateResponse(conversationId: string) {
		try {
			// Obtener conversación
			const { data: conversation, error: conversationError } = await supabaseAdmin
				.from("conversations")
				.select("*, agents:agent_id(*)")
				.eq("id", conversationId)
				.single<Conversation>();
			if (conversationError) throw conversationError;

			// Verificar agente asignado
			const agent = conversation.agents;
			if (!agent) throw new Error("No agent assigned to conversation");
			if (agent.status !== "active") throw new Error("Agent is not active");

			// Obtener historial de conversación (Últimos 20 mensajes)
			const { data: messages, error: messagesError } = await supabaseAdmin
				.from("messages")
				.select("*")
				.eq("conversation_id", conversationId)
				.order("created_at", { ascending: true })
				.limit(20)
				.returns<Message[]>();
			if (messagesError) throw messagesError;

			// Obtener endpoints del agente
			const { data: endpoints, error: endpointsError } = await supabaseAdmin
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
						====== START | AVAILABLE ACTIONS ======
						You have access to the following actions to help the user.
						When you need to use one, respond EXACTLY in this format (IGNORE the parentheses, they are instructions for you):
						[USE_ACTION: action_id] (MANDATORY, always)
						[PARAMETERS: {"param1": "value", "param2": "value"}] (MANDATORY, if required parameters exist)

						List of Actions:
						${endpoints
							.map(
								(endpoint) => `
									- ${endpoint.name}: ${endpoint.description}
									ID: ${endpoint.id}
									${Object.keys(endpoint.params_schema).length > 0 ? `Required parameters: ${JSON.stringify(endpoint.params_schema)}` : ""}
								`
							)
							.join("\n")}
						====== END | AVAILABLE ACTIONS ======

					`
					: "";

			// Construir mensajes para la IA
			const messagesForAI: MessageForAI[] = [
				{
					role: "system",
					content: `
						====== START | SYSTEM PROMPT ======
						${agent.system_prompt}
						====== END | SYSTEM PROMPT ======

						${actionsDescription}

						====== START | User Information (this is the person you will respond to) ======
						- Name: ${conversation.customer_name || "Not provided"}
						- Email: ${conversation.customer_email || "Not provided"}
						- Phone: ${conversation.customer_phone || "Not provided"}
						====== END | User Information ======

						====== START | Conversation Information ======
						- Channel: ${conversation.channel}
						- Priority: ${conversation.priority}
						====== END | Conversation Information ======

						====== START | IMPORTANT ======
						- LIMIT your response to the user's last message in a professional and subtle manner (use the rest of the messages as context).
						- LIMIT yourself to the behavior described in the =SYSTEM PROMPT= section.
						- If you need to execute an action, use the exact format specified above with the action ID in your response.
						- NEVER invent or modify action IDs.
						- NEVER invent or modify the specified format for action responses.
						- ALWAYS and AT ALL TIMES, what is described in the =SYSTEM PROMPT= takes higher priority than the actions.
						- NEVER should what is described in =SYSTEM PROMPT= take higher priority than 'Conversation Information' or 'User Information'.
						- When saying goodbye to the user (when they have no more questions or requests), add the following format at the end of the message (NEVER modify it): [END_CONVERSATION]
						====== END | IMPORTANT ======

					`,
				},
				...(messages.map((message) => {
					let message_role: MessageForAI["role"];
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
					const actionResult = await Endpoints_Service.executor(actionMatch.id, actionMatch.parameters);

					// Agregar el resultado de la ejecución de la acción al contexto de la IA
					messagesForAI.push({
						role: "assistant",
						content: initialResponse,
					});

					messagesForAI.push({
						role: "system",
						content: `
							====== START | ACTION RESULT "${endpoint.name}" ======
							${actionResult.success ? `✓ Success (${actionResult.duration}ms) Response: ${JSON.stringify(actionResult.data, null, 2)}` : `✗ Error: ${actionResult.error}`}

							- Now respond to the user based on this result.
							- DO NOT repeat the result format, just provide a natural and helpful response.
							====== END | ACTION RESULT ======
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

			// Logica [END_CONVERSATION]
			if (/\[END_CONVERSATION\]/i.test(initialResponse)) {
				const { error: updateError } = await supabaseAdmin
					.from("conversations")
					.update({
						status: "closed",
						closed_at: new Date().toISOString(),
					})
					.eq("id", conversationId);
				if (updateError) throw updateError;
			}

			// Si no se requiere ejecutar alguna acción o no se encontró, retornar la respuesta inicial
			return { success: true, message: initialResponse.replace("[END_CONVERSATION]", "") };
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
}

export const ai = new AI();
