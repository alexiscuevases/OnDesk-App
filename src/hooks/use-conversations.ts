"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Conversation } from "@/lib/validations/conversation";
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
	} = useQuery<Conversation[]>({
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
		} catch (err: unknown) {
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
	const deleteConversation = async (id: string) => await deleteConversationMutation.mutateAsync(id);

	const assignAgentMutation = useMutation({
		mutationFn: async ({ conversationId, agentId }: { conversationId: string; agentId: string }) => {
			if (!profile) throw new Error("Not authenticated");

			const { error: updateError } = await supabase.from("conversations").update({ agent_id: agentId }).eq("id", conversationId);
			if (updateError) throw updateError;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations", profile?.team_id] });
		},
	});
	const assignAgentToConversation = async (conversationId: string, agentId: string) => await assignAgentMutation.mutateAsync({ conversationId, agentId });

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
						queryClient.setQueryData<Conversation[]>(["conversations", profile.team_id], (old = []) => {
							const newConversation = payload.new as Conversation;
							const exists = old.some((conv) => conv.id === newConversation.id);
							if (exists) return old.map((conv) => (conv.id === newConversation.id ? newConversation : conv));
							return [newConversation, ...old];
						});
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
		deleteConversation,
		assignAgentToConversation,
	};
}
