import { createClient } from "./supabase/server";
import { Agent } from "./validations/agent";
import { Conversation } from "./validations/conversation";
import { Message } from "./validations/message";
import { generateText } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";

export class AI {
	async generateAgentResponse(conversationId: string): Promise<{
		success: boolean;
		response?: string;
		error?: string;
	}> {
		try {
			const supabase = await createClient();

			console.log("[AI Agent] Generating response for conversation:", conversationId);

			// Get the conversation with agent info
			const { data: conversation, error: conversationError } = await supabase
				.from("conversations")
				.select("*")
				.eq("id", conversationId)
				.single<Conversation>();
			if (conversationError || !conversation) {
				console.error("[AI Agent] Conversation not found:", conversationError);
				return { success: false, error: "Conversation not found" };
			}

			// Check if conversation has an agent assigned
			if (!conversation.agent_id) {
				console.log("[AI Agent] No agent assigned to conversation");
				return { success: false, error: "No agent assigned to conversation" };
			}

			// Get the agent
			const { data: agent, error: agentError } = await supabase.from("agents").select("*").eq("id", conversation.agent_id).single<Agent>();
			if (agentError || !agent) {
				console.error("[AI Agent] Agent not found:", agentError);
				return { success: false, error: "Agent not found" };
			}

			// Check if agent is active
			if (agent.status !== "active") {
				console.log("[AI Agent] Agent is not active:", agent.status);
				return { success: false, error: "Agent is not active" };
			}

			// Get conversation history (last 20 messages)
			const { data: messages, error: messagesError } = await supabase
				.from("messages")
				.select("*")
				.eq("conversation_id", conversationId)
				.order("created_at", { ascending: true })
				.limit(20);
			if (messagesError) {
				console.error("[AI Agent] Error fetching messages:", messagesError);
				return { success: false, error: "Error fetching conversation history" };
			}

			// Build the conversation context
			const conversationHistory = messages
				?.map((msg: Message) => {
					const role = msg.role === "agent" ? "assistant" : msg.role === "user" ? "user" : "system";
					return `${role}: ${msg.content}`;
				})
				.join("\n");

			// Build the prompt with context
			const prompt = `
                ${agent.system_prompt}

                Información del cliente:
                - Nombre: ${conversation.customer_name || "No proporcionado"}
                - Email: ${conversation.customer_email || "No proporcionado"}
                - Teléfono: ${conversation.customer_phone || "No proporcionado"}
                - Canal: ${conversation.channel}
                - Prioridad: ${conversation.priority}

                Historial de conversación:
                ${conversationHistory}

                Por favor, responde al último mensaje del usuario de manera profesional y útil.
            `;

			console.log("[AI Agent] Generating response with GPT-4...");

			const deepseek = createDeepSeek({
				apiKey: process.env.DEEPSEEK_API_KEY ?? "",
			});

			const { text, usage, finishReason } = await generateText({
				model: deepseek("deepseek-chat"),
				prompt,
				maxOutputTokens: agent.max_tokens,
				temperature: agent.temperature,
			});

			console.log("[AI Agent] Response generated:", {
				length: text.length,
				usage,
				finishReason,
			});

			return {
				success: true,
				response: text,
			};
		} catch (error) {
			console.error("[AI Agent] Exception generating response:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}
}

export const ai = new AI();
