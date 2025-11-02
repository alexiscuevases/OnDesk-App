"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/lib/validations/message";
import { useAuth } from "@/components/providers/auth-provider";
import { Connection } from "@/lib/validations/connection";
import { Conversation } from "@/lib/validations/conversation";
import { createWhatsAppAPI } from "@/lib/whatsapp";

interface SendMessageByConnectionId {
	connectionId: string;
	role: Message["role"];
	to: string;
	message: string;
}

interface SendMessageByConversationId {
	conversationId: string;
	role: Message["role"];
	message: string;
}

export function useMessages(conversationId: string) {
	const { profile } = useAuth();
	const supabase = createClient();
	const queryClient = useQueryClient();

	const {
		data: messages = [],
		isLoading,
		error,
		refetch: fetchMessages,
	} = useQuery<Message[]>({
		queryKey: ["messages", conversationId],
		queryFn: async () => {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: fetchError } = await supabase
				.from("messages")
				.select("*")
				.eq("conversation_id", conversationId)
				.order("created_at", { ascending: true })
				.returns<Message[]>();
			if (fetchError) throw fetchError;

			return data || [];
		},
		enabled: !!profile && !!conversationId,
	});

	const sendMessageByConnectionIdMutation = useMutation({
		mutationFn: async ({ connectionId, role, to, message }: SendMessageByConnectionId) => {
			if (!profile) throw new Error("Not authenticated");

			const { data: connection, error: connectionError } = await supabase.from("connections").select("*").eq("id", connectionId).single<Connection>();
			if (connectionError) throw connectionError;

			const query = supabase.from("conversations").select("*");
			if (connection.type === "whatsapp") query.eq("customer_phone", to);
			const { data: conversation, error: conversationError } = await query.maybeSingle<Conversation>();
			if (conversationError) throw conversationError;

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
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
		},
	});

	const sendMessageByConnectionId = async ({ connectionId, role, to, message }: SendMessageByConnectionId) =>
		await sendMessageByConnectionIdMutation.mutateAsync({ connectionId, role, to, message });

	const sendMessageByConversationIdMutation = useMutation({
		mutationFn: async ({ conversationId, role, message }: SendMessageByConversationId) => {
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
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
		},
	});

	const sendMessageByConversationId = async ({ conversationId, role, message }: SendMessageByConversationId) =>
		await sendMessageByConversationIdMutation.mutateAsync({ conversationId, role, message });

	useEffect(() => {
		if (!conversationId) return;

		const messagesChannel = supabase
			.channel(`messages-${conversationId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "messages",
					filter: `conversation_id=eq.${conversationId}`,
				},
				(payload) => {
					if (payload.eventType === "INSERT") {
						queryClient.setQueryData<Message[]>(["messages", conversationId], (old = []) => {
							const newMsg = payload.new as Message;
							const exists = old.find((msg) => msg.id === newMsg.id);
							if (exists) return old.map((msg) => (msg.id === newMsg.id ? newMsg : msg));
							return [...old, newMsg];
						});
					} else if (payload.eventType === "UPDATE") {
						queryClient.setQueryData<Message[]>(["messages", conversationId], (old = []) =>
							old.map((msg) => (msg.id === payload.new.id ? (payload.new as Message) : msg))
						);
					} else if (payload.eventType === "DELETE") {
						queryClient.setQueryData<Message[]>(["messages", conversationId], (old = []) => old.filter((msg) => msg.id !== payload.old.id));
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(messagesChannel);
		};
	}, [conversationId, queryClient]);

	return {
		messages,
		isLoading,
		error: error?.message || null,
		fetchMessages,
		sendMessageByConnectionId,
		sendMessageByConversationId,
	};
}
