"use client";

import { AppConfigs } from "@/configs/app";
import { createClient } from "@/lib/supabase/client";
import { Connection } from "@/lib/validations/connection";
import { Conversation } from "@/lib/validations/conversation";
import { Message } from "@/lib/validations/message";
import { StartConversationInput } from "@/lib/validations/widget";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useWidget(connectionId: string) {
	const [conversation, setConversation] = useState<Conversation | null>(null);
	const supabase = createClient();
	const queryClient = useQueryClient();

	const {
		data: messages = [],
		isLoading,
		error,
		refetch: fetchMessages,
	} = useQuery<Message[]>({
		queryKey: ["messages", conversation?.id],
		queryFn: async () => {
			const { data, error: fetchError } = await supabase
				.from("messages")
				.select("*")
				.eq("conversation_id", conversation?.id)
				.order("created_at", { ascending: true })
				.returns<Message[]>();
			if (fetchError) throw fetchError;

			return data || [];
		},
		enabled: !!conversation,
	});

	const startConversationMutation = useMutation({
		mutationFn: async (input: StartConversationInput) => {
			const { data: connection, error: connectionError } = await supabase.from("connections").select("*").eq("id", connectionId).single<Connection>();
			if (connectionError) throw connectionError;

			const { data: newConversation, error: conversationError } = await supabase
				.from("conversations")
				.insert({
					team_id: connection.team_id,
					connection_id: connectionId,
					customer_name: input.customer_name,
					customer_email: input.customer_email,
					channel: "website",
				})
				.select("*")
				.single<Conversation>();
			if (conversationError) throw conversationError;

			setConversation(newConversation);

			localStorage.setItem(`conversation-${connectionId}`, JSON.stringify(newConversation));
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["widget", "conversations", conversation?.id] });
		},
	});
	const startConversation = async (input: StartConversationInput) => await startConversationMutation.mutateAsync(input);

	const sendMessageMutation = useMutation({
		mutationFn: async (message: string) => {
			if (!conversation) return;

			const { data, error: messageError } = await supabase
				.from("messages")
				.insert({
					conversation_id: conversation?.id,
					role: "user",
					content: message,
					content_type: "text",
				})
				.select()
				.single<Message>();
			if (messageError) throw messageError;

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["messages", conversation?.id] });
		},
	});
	const sendMessage = async (message: string) => await sendMessageMutation.mutateAsync(message);

	useEffect(() => {
		const storedConversation = localStorage.getItem(`conversation-${connectionId}`);
		if (storedConversation) setConversation(JSON.parse(storedConversation));
	}, [connectionId]);

	useEffect(() => {
		if (!conversation) return;

		const messagesChannel = supabase
			.channel(`messages-${conversation.id}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "messages",
					filter: `conversation_id=eq.${conversation.id}`,
				},
				(payload) => {
					if (payload.eventType === "INSERT") {
						queryClient.setQueryData<Message[]>(["messages", conversation.id], (old = []) => {
							const newMsg = payload.new as Message;
							const exists = old.find((msg) => msg.id === newMsg.id);
							if (exists) return old.map((msg) => (msg.id === newMsg.id ? newMsg : msg));

							let audio;
							if (newMsg.role !== "user") audio = new Audio(`${AppConfigs.url}/sounds/notification.mp3`);
							else audio = new Audio(`${AppConfigs.url}/sounds/pop.mp3`);
							audio.play();

							return [...old, newMsg];
						});
					} else if (payload.eventType === "UPDATE") {
						queryClient.setQueryData<Message[]>(["messages", conversation.id], (old = []) =>
							old.map((msg) => (msg.id === payload.new.id ? (payload.new as Message) : msg))
						);
					} else if (payload.eventType === "DELETE") {
						queryClient.setQueryData<Message[]>(["messages", conversation.id], (old = []) => old.filter((msg) => msg.id !== payload.old.id));
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(messagesChannel);
		};
	}, [conversation, queryClient]);

	return {
		messages,
		isLoading,
		error,
		fetchMessages,
		conversation,
		startConversation,
		startConversationIsLoading: startConversationMutation.isPending,
		startConversationError: startConversationMutation.error,
		sendMessage,
		sendMessageIsLoading: sendMessageMutation.isPending,
		sendMessageError: sendMessageMutation.error,
	};
}
