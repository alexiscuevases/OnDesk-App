"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Agent, CreateAgentInput, UpdateAgentInput } from "@/lib/validations/agent";
import { useAuth } from "@/components/providers/auth-provider";

export function useAgents() {
	const { profile } = useAuth();
	const supabase = createClient();
	const queryClient = useQueryClient();

	const {
		data: agents = [],
		isLoading,
		error,
		refetch: fetchAgents,
	} = useQuery({
		queryKey: ["agents", profile?.team_id],
		queryFn: async () => {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: fetchError } = await supabase
				.from("agents")
				.select("*")
				.eq("team_id", profile.team_id)
				.order("created_at", { ascending: false });
			if (fetchError) throw fetchError;

			return data || [];
		},
		enabled: !!profile,
	});

	const createAgentMutation = useMutation({
		mutationFn: async (input: CreateAgentInput) => {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: createError } = await supabase
				.from("agents")
				.insert({
					team_id: input.team_id,
					avatar_url: input.avatar_url,
					name: input.name,
					description: input.description,
					type: input.type,
					model: input.model,
					system_prompt: input.system_prompt,
					temperature: input.temperature,
					max_tokens: input.max_tokens,
					status: input.status,
				})
				.select("*")
				.single<Agent>();
			if (createError) throw createError;

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["agents", profile?.team_id] });
		},
	});

	const createAgent = async (input: CreateAgentInput) => await createAgentMutation.mutateAsync(input);

	const updateAgentMutation = useMutation({
		mutationFn: async ({ id, input }: { id: string; input: UpdateAgentInput }) => {
			if (!profile) throw new Error("Not authenticated");

			const updateData: UpdateAgentInput = {};
			if (input.avatar_url) updateData.avatar_url = input.avatar_url;
			if (input.name) updateData.name = input.name;
			if (input.description) updateData.description = input.description;
			if (input.type) updateData.type = input.type;
			if (input.model) updateData.model = input.model;
			if (input.system_prompt) updateData.system_prompt = input.system_prompt;
			if (input.temperature) updateData.temperature = input.temperature;
			if (input.max_tokens) updateData.max_tokens = input.max_tokens;
			if (input.status) updateData.status = input.status;

			const { data, error: updateError } = await supabase.from("agents").update(updateData).eq("id", id).select("*").single<Agent>();
			if (updateError) throw updateError;

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["agents", profile?.team_id] });
		},
	});

	const updateAgent = async (id: string, input: UpdateAgentInput) => await updateAgentMutation.mutateAsync({ id, input });

	const deleteAgentMutation = useMutation({
		mutationFn: async (id: string) => {
			if (!profile) throw new Error("Not authenticated");

			const { error: deleteError } = await supabase.from("agents").delete().eq("id", id);
			if (deleteError) throw deleteError;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["agents", profile?.team_id] });
		},
	});

	const deleteAgent = async (id: string) => await deleteAgentMutation.mutateAsync(id);

	return {
		agents,
		isLoading,
		error: error?.message || null,
		fetchAgents,
		createAgent,
		updateAgent,
		deleteAgent,
	};
}
