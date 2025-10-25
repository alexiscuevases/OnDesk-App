"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AgentInput } from "@/lib/validations/agent";

export interface Agent {
	id: string;
	name: string;
	description: string | null;
	type: string;
	model: string;
	system_prompt: string;
	temperature: number;
	max_tokens: number;
	status: string;
	avatar_url: string | null;
	created_at: string;
	updated_at: string;
	user_id: string;
}

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

			const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single();
			if (profileError) throw profileError;

			const { data, error: fetchError } = await supabase.from("agents").select("*").eq("team_id", user.id).order("created_at", { ascending: false });

			if (fetchError) throw fetchError;

			setAgents(data || []);
		} catch (err: any) {
			setError(err.message || "Failed to fetch agents");
		} finally {
			setIsLoading(false);
		}
	};

	const createAgent = async (input: AgentInput) => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { data, error: createError } = await supabase
				.from("agents")
				.insert({
					team_id: input.team_id,
					name: input.name,
					description: input.description,
					type: input.type,
					model: input.model,
					system_prompt: input.systemPrompt,
					temperature: input.temperature,
					max_tokens: input.maxTokens,
					status: input.status,
					user_id: user.id,
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

	const updateAgent = async (id: string, input: Partial<AgentInput>) => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const updateData: any = {};
			if (input.name) updateData.name = input.name;
			if (input.description !== undefined) updateData.description = input.description;
			if (input.type) updateData.type = input.type;
			if (input.model) updateData.model = input.model;
			if (input.systemPrompt) updateData.system_prompt = input.systemPrompt;
			if (input.temperature !== undefined) updateData.temperature = input.temperature;
			if (input.maxTokens) updateData.max_tokens = input.maxTokens;
			if (input.status) updateData.status = input.status;
			updateData.updated_at = new Date().toISOString();

			const { data, error: updateError } = await supabase.from("agents").update(updateData).eq("id", id).eq("user_id", user.id).select().single();

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

			const { error: deleteError } = await supabase.from("agents").delete().eq("id", id).eq("user_id", user.id);

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
