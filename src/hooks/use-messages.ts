"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/lib/validations/message";
import { useAuth } from "@/components/providers/auth-provider";
import { Connection } from "@/lib/validations/connection";
import { Conversation } from "@/lib/validations/conversation";
import { createWhatsAppAPI } from "@/lib/whatsapp";

interface SendMessage {
	role: Message["role"];
	message: string;
}

export function useMessages(conversationId?: string) {
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

	const sendMessageMutation = useMutation({
		mutationFn: async ({ role, message }: SendMessage) => {
			if (!profile) throw new Error("Not authenticated");

			const { data: conversation, error: conversationError } = await supabase
				.from("conversations")
				.select("*")
				.eq("id", conversationId)
				.single<Conversation>();
			if (conversationError) throw conversationError;

			const { data: connection, error: connectionError } = await supabase
				.from("connections")
				.select("*")
				.eq("id", conversation.connection_id)
				.single<Connection>();
			if (connectionError) throw connectionError;

			if (connection.type === "whatsapp") {
				const whatsapp = createWhatsAppAPI(connection.config.phoneNumberId, connection.config.apiKey);
				const whatsappResponse = await whatsapp.sendTextMessage(conversation.customer_phone, message);

				const { data, error: messageError } = await supabase
					.from("messages")
					.insert({
						conversation_id: conversationId,
						role,
						content: message,
						content_type: "text",
						metadata: {
							whatsapp_message_id: whatsappResponse.messages[0].id,
						},
					})
					.select()
					.single<Message>();

				if (messageError) throw messageError;
				return data;
			} else if (connection.type === "website") {
				const { data, error: messageError } = await supabase
					.from("messages")
					.insert({
						conversation_id: conversationId,
						role,
						content: message,
						content_type: "text",
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
	const sendMessage = async ({ role, message }: SendMessage) => await sendMessageMutation.mutateAsync({ role, message });

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
		sendMessage,
		isLoadingSendMessage: sendMessageMutation.isPending,
	};
}
