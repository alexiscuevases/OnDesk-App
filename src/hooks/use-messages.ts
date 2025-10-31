"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/lib/validations/message";
import { useAuth } from "@/components/providers/auth-provider";

export function useMessages(conversationId: string) {
	const { profile } = useAuth();
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const supabase = createClient();

	const fetchMessages = async () => {
		setIsLoading(true);
		setError(null);

		try {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: fetchError } = await supabase
				.from("messages")
				.select("*")
				.eq("conversation_id", conversationId)
				.order("created_at", { ascending: true })
				.returns<Message[]>();
			if (fetchError) throw fetchError;

			setMessages(data || []);
		} catch (err: any) {
			setError(err.message || "Failed to fetch messages");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchMessages();
	}, []);

	useEffect(() => {
		if (!conversationId) return;

		// Subscribe to messages changes
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
						setMessages((prev) => {
							const exists = prev.some((msg) => msg.id === payload.new.id);
							if (exists) return prev;
							return [...prev, payload.new as Message];
						});
					} else if (payload.eventType === "UPDATE") {
						setMessages((prev) => prev.map((msg) => (msg.id === payload.new.id ? (payload.new as Message) : msg)));
					} else if (payload.eventType === "DELETE") {
						setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
					}
				}
			)
			.subscribe();

		// Cleanup subscriptions on unmount
		return () => {
			supabase.removeChannel(messagesChannel);
		};
	}, [conversationId]);

	return {
		messages,
		isLoading,
		error,
	};
}
