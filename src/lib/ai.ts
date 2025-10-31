import { createClient } from "./supabase/server";
import { Agent } from "./validations/agent";
import { Conversation } from "./validations/conversation";
import { Message } from "./validations/message";
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

			// Build the conversation context
			const conversationHistory = messages
				?.map((msg) => {
					const role = msg.role === "agent" ? "assistant" : msg.role === "user" ? "user" : "system";
					return `${role}: ${msg.content}`;
				})
				.join("\n");

			// Build the prompt with context
			const prompt = `
				System Prompt:
                ${agent.system_prompt}

                Información del cliente:
                - Nombre: ${conversation.customer_name || "No proporcionado"}
                - Email: ${conversation.customer_email || "No proporcionado"}
                - Teléfono: ${conversation.customer_phone || "No proporcionado"}
                - Canal: ${conversation.channel}
                - Prioridad: ${conversation.priority}

                Historial de conversación:
                ${conversationHistory}

				IMPORTANTE:
                - Por favor, responde al último mensaje del usuario de manera profesional y útil.
				- Por favor, limitate a cómo te describe el system prompt, no hagas nada que no esté descrito en el system promt.
            `;

			const deepseek = createDeepSeek({
				apiKey: process.env.DEEPSEEK_API_KEY ?? "",
			});

			const { text } = await generateText({
				model: deepseek("deepseek-chat"),
				prompt,
				maxOutputTokens: agent.max_tokens,
				temperature: agent.temperature,
			});

			return text;
		} catch (err: any) {
			throw err;
		}
	}
}

export const ai = new AI();
