"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

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

			const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single();
			if (profileError) throw profileError;

			const { data, error: fetchError } = await supabase
				.from("conversations")
				.select("*")
				.eq("team_id", profile.team_id)
				.order("created_at", { ascending: false });

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
				.order("created_at", { ascending: true });

			if (fetchError) throw fetchError;

			return data as Message[];
		} catch (err: any) {
			throw new Error(err.message || "Failed to fetch messages");
		}
	};

	const updateConversation = async (id: string, input: Partial<Conversation>) => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const updateData: any = {};

			const { data, error: updateError } = await supabase.from("conversations").update(updateData).eq("id", id).select().single();

			if (updateError) throw updateError;

			await fetchConversations();
			return data;
		} catch (err: any) {
			setError(err.message || "Failed to update conversation");
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

	useEffect(() => {
		fetchConversations();
	}, []);

	return {
		conversations,
		isLoading,
		error,
		fetchConversations,
		fetchConversationMessages,
		updateConversation,
		deleteConversation,
	};
}
