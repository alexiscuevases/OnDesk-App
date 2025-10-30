"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Conversation } from "@/lib/validations/conversation";
import { Message } from "@/lib/validations/message";
import { Profile } from "@/lib/validations/profile";
import { createWhatsAppAPI } from "@/lib/whatsapp";
import { Connection } from "@/lib/validations/connection";

export function useConversations() {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const supabase = createClient();

	const fetchConversations = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single<Profile>();
			if (profileError || !profile) throw profileError ?? new Error("Profile not found");

			const { data, error: fetchError } = await supabase
				.from("conversations")
				.select("*")
				.eq("team_id", profile.team_id)
				.order("created_at", { ascending: false })
				.returns<Conversation[]>();
			if (fetchError) throw fetchError;

			setConversations(data || []);
		} catch (err: any) {
			setError(err.message || "Failed to fetch conversations");
		} finally {
			setIsLoading(false);
		}
	};

	const fetchConversationMessages = async (conversationId: string) => {
		try {
			const { data, error: fetchError } = await supabase
				.from("messages")
				.select("*")
				.eq("conversation_id", conversationId)
				.order("created_at", { ascending: true })
				.returns<Message[]>();
			if (fetchError) throw fetchError;

			return data || [];
		} catch (err: any) {
			throw new Error(err.message || "Failed to fetch messages");
		}
	};

	const fetchConversationById = async (conversationId: string) => {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { data, error } = await supabase.from("conversations").select("*").eq("id", conversationId).single<Conversation>();
			if (error) throw error;

			return data;
		} catch (err: any) {
			throw err;
		}
	};

	const deleteConversation = async (id: string) => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { error: deleteError } = await supabase.from("conversations").delete().eq("id", id);
			if (deleteError) throw deleteError;

			await fetchConversations();
		} catch (err: any) {
			setError(err.message || "Failed to delete conversation");
			throw err;
		}
	};

	const sendMessageByConnectionId = async ({
		connectionId,
		role,
		to,
		message,
	}: {
		connectionId: string;
		role: Message["role"];
		to: string;
		message: string;
	}) => {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single<Profile>();
			if (profileError || !profile) throw profileError ?? new Error("Profile not found");

			const { data: connection, error: connectionError } = await supabase.from("connections").select("*").eq("id", connectionId).single<Connection>();
			if (connectionError || !connection) throw connectionError ?? new Error("Connection not exists");

			let query = supabase.from("conversations").select("*");
			if (connection.type === "whatsapp") query.eq("customer_phone", to);
			const { data: conversation, error: conversationError } = await query.maybeSingle<Conversation>();
			if (conversationError) throw connectionError;

			let currentConversation = conversation;
			if (!currentConversation) {
				const { data: newConversation, error: newConversationError } = await supabase
					.from("conversations")
					.insert({
						team_id: profile.team_id,
						connection_id: connectionId,
						agent_id: undefined,
						customer_name: "",
						customer_email: "",
						customer_phone: connection.type === "whatsapp" ? to : "",
						channel: connection.type,
						status: "open",
						priority: "medium",
					})
					.select()
					.single<Conversation>();
				if (newConversationError) throw newConversationError;
				currentConversation = newConversation;
			}

			if (connection.type === "whatsapp") {
				const whatsapp = createWhatsAppAPI(connection.config.phoneNumberId, connection.config.apiKey);
				await whatsapp.sendTextMessage(to, message);

				const { data, error: messageError } = await supabase
					.from("messages")
					.insert({
						conversation_id: currentConversation?.id,
						role,
						content: message,
					})
					.select()
					.single<Message>();
				if (messageError) throw messageError;
				return data;
			}

			return null;
		} catch (err: any) {
			throw err;
		}
	};

	const sendMessageByConversationId = async ({ conversationId, role, message }: { conversationId: string; role: Message["role"]; message: string }) => {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { data: conversation, error: conversationError } = await supabase
				.from("conversations")
				.select("*")
				.eq("id", conversationId)
				.single<Conversation>();
			if (conversationError || !conversation) throw conversationError ?? new Error("Conversation not exists");

			return await sendMessageByConnectionId({
				connectionId: conversation.connection_id,
				role,
				to: conversation.customer_phone as string,
				message,
			});
		} catch (err: any) {
			throw err;
		}
	};

	const assignAgentToConversation = async (conversationId: string, agentId: string) => {
		try {
			const { error: updateError } = await supabase.from("conversations").update({ agent_id: agentId }).eq("id", conversationId);
			if (updateError) throw updateError;
		} catch (err: any) {
			throw err;
		}
	};

	useEffect(() => {
		fetchConversations();
	}, []);

	return {
		conversations,
		isLoading,
		error,
		fetchConversations,
		fetchConversationById,
		fetchConversationMessages,
		deleteConversation,

		sendMessageByConnectionId,
		sendMessageByConversationId,
		assignAgentToConversation,
	};
}
