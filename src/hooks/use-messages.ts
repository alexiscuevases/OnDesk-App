"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/lib/validations/message";
import { useAuth } from "@/components/providers/auth-provider";

export function useMessages(conversationId: string) {
	const { profile } = useAuth();
	const supabase = createClient();
	const queryClient = useQueryClient();

	const {
		data: messages = [],
		isLoading,
		error,
	} = useQuery({
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
	};
}
