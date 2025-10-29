"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Agent, CreateAgentInput, UpdateAgentInput } from "@/lib/validations/agent";
import { Profile } from "@/lib/validations/profile";

export function useAgents() {
	const [agents, setAgents] = useState<Agent[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const supabase = createClient();

	const fetchAgents = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { data: profile, error: profileError }: { data: Profile | null; error: any } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", user.id)
				.single();
			if (profileError || !profile) throw profileError ?? new Error("Profile not found");

			const { data, error: fetchError }: { data: Agent[] | null; error: any } = await supabase
				.from("agents")
				.select("*")
				.eq("team_id", profile.team_id)
				.order("created_at", { ascending: false });
			if (fetchError) throw fetchError;

			setAgents(data || []);
		} catch (err: any) {
			setError(err.message || "Failed to fetch agents");
		} finally {
			setIsLoading(false);
		}
	};

	const createAgent = async (input: CreateAgentInput) => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { data, error: createError }: { data: Agent | null; error: any } = await supabase
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
				.select()
				.single();
			if (createError) throw createError;

			await fetchAgents();
			return data;
		} catch (err: any) {
			setError(err.message || "Failed to create agent");
			throw err;
		}
	};

	const updateAgent = async (id: string, input: UpdateAgentInput) => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const updateData: UpdateAgentInput = {};
			if (input.avatar_url) updateData.avatar_url = input.avatar_url;
			if (input.name) updateData.name = input.name;
			if (input.description !== undefined) updateData.description = input.description;
			if (input.type) updateData.type = input.type;
			if (input.model) updateData.model = input.model;
			if (input.system_prompt) updateData.system_prompt = input.system_prompt;
			if (input.temperature !== undefined) updateData.temperature = input.temperature;
			if (input.max_tokens) updateData.max_tokens = input.max_tokens;
			if (input.status) updateData.status = input.status;

			const { data, error: updateError }: { data: Agent | null; error: any } = await supabase
				.from("agents")
				.update(updateData)
				.eq("id", id)
				.select()
				.single();
			if (updateError) throw updateError;

			await fetchAgents();
			return data;
		} catch (err: any) {
			setError(err.message || "Failed to update agent");
			throw err;
		}
	};

	const deleteAgent = async (id: string) => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { error: deleteError } = await supabase.from("agents").delete().eq("id", id);
			if (deleteError) throw deleteError;

			await fetchAgents();
		} catch (err: any) {
			setError(err.message || "Failed to delete agent");
			throw err;
		}
	};

	useEffect(() => {
		fetchAgents();
	}, []);

	return {
		agents,
		isLoading,
		error,
		fetchAgents,
		createAgent,
		updateAgent,
		deleteAgent,
	};
}
