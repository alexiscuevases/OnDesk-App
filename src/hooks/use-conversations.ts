"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Conversation } from "@/lib/validations/conversation";
import type { Message } from "@/lib/validations/message";
import { createWhatsAppAPI } from "@/lib/whatsapp";
import type { Connection } from "@/lib/validations/connection";
import { useAuth } from "@/components/providers/auth-provider";

export function useConversations() {
	const { profile } = useAuth();
	const supabase = createClient();
	const queryClient = useQueryClient();

	const {
		data: conversations = [],
		isLoading,
		error,
		refetch: fetchConversations,
	} = useQuery({
		queryKey: ["conversations", profile?.team_id],
		queryFn: async () => {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: fetchError } = await supabase
				.from("conversations")
				.select("*")
				.eq("team_id", profile.team_id)
				.order("created_at", { ascending: false })
				.returns<Conversation[]>();
			if (fetchError) throw fetchError;

			return data || [];
		},
		enabled: !!profile,
	});

	const fetchConversationById = async (conversationId: string) => {
		try {
			if (!profile) throw new Error("Not authenticated");

			const { data, error } = await supabase.from("conversations").select("*").eq("id", conversationId).single<Conversation>();
			if (error) throw error;

			return data;
		} catch (err: any) {
			throw err;
		}
	};

	const deleteConversationMutation = useMutation({
		mutationFn: async (id: string) => {
			if (!profile) throw new Error("Not authenticated");

			const { error: deleteError } = await supabase.from("conversations").delete().eq("id", id);
			if (deleteError) throw deleteError;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations", profile?.team_id] });
		},
	});

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
			if (!profile) throw new Error("Not authenticated");

			const { data: connection, error: connectionError } = await supabase.from("connections").select("*").eq("id", connectionId).single<Connection>();
			if (connectionError || !connection) throw connectionError ?? new Error("Connection not exists");

			const query = supabase.from("conversations").select("*");
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
			if (!profile) throw new Error("Not authenticated");

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
		if (!profile) return;

		const conversationsChannel = supabase
			.channel("conversations-changes")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "conversations",
					filter: `team_id=eq.${profile.team_id}`,
				},
				(payload) => {
					if (payload.eventType === "INSERT") {
						queryClient.setQueryData<Conversation[]>(["conversations", profile.team_id], (old = []) => [payload.new as Conversation, ...old]);
					} else if (payload.eventType === "UPDATE") {
						queryClient.setQueryData<Conversation[]>(["conversations", profile.team_id], (old = []) =>
							old.map((conv) => (conv.id === payload.new.id ? (payload.new as Conversation) : conv))
						);
					} else if (payload.eventType === "DELETE") {
						queryClient.setQueryData<Conversation[]>(["conversations", profile.team_id], (old = []) =>
							old.filter((conv) => conv.id !== payload.old.id)
						);
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(conversationsChannel);
		};
	}, [profile, queryClient]);

	return {
		conversations,
		isLoading,
		error: error?.message || null,
		fetchConversations,
		fetchConversationById,
		deleteConversation: deleteConversationMutation.mutate,

		sendMessageByConnectionId,
		sendMessageByConversationId,
		assignAgentToConversation,
	};
}
