"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { InstallMarketplaceInput, Marketplace } from "@/lib/validations/marketplace";
import { useAgents } from "./use-agents";
import { useEndpoints } from "./use-endpoints";
import { Endpoint } from "@/lib/validations/endpoint";

export function useMarketplace() {
	const { profile } = useAuth();
	const supabase = createClient();
	const queryClient = useQueryClient();
	const { createAgent } = useAgents();
	const { createEndpoint } = useEndpoints();

	const {
		data: marketplace = [],
		isLoading,
		error,
		refetch: fetchMarketplace,
	} = useQuery<Marketplace[]>({
		queryKey: ["marketplace", profile?.team_id],
		queryFn: async () => {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: fetchError } = await supabase
				.from("marketplace")
				.select("*")
				.order("created_at", { ascending: false })
				.returns<Marketplace[]>();
			if (fetchError) throw fetchError;

			return data || [];
		},
		enabled: !!profile,
	});

	const fetchMarketplaceById = async (marketplaceId: string) => {
		try {
			if (!profile) throw new Error("Not authenticated");

			const { data, error } = await supabase.from("marketplace").select("*").eq("id", marketplaceId).single<Marketplace>();
			if (error) throw error;

			return data;
		} catch (err: unknown) {
			throw err;
		}
	};

	const installMarketplaceItemMutation = useMutation({
		mutationFn: async (input: InstallMarketplaceInput) => {
			if (!profile) throw new Error("Not authenticated");

			const newAgent = await createAgent({
				team_id: input.team_id,
				avatar_url: input.avatar_url,
				name: input.name,
				description: input.description,
				type: "general",
				system_prompt: input.agent_system_prompt,
				status: "active",
			});

			input.agent_endpoints?.forEach(async (endpointId) => {
				const { data, error } = await supabase.from("endpoints").select("*").eq("id", endpointId).single<Endpoint>();
				if (error) throw error;

				await createEndpoint({
					agent_id: newAgent.id,
					name: data.name,
					description: data.description,
					method: data.method,
					url: data.url,
					headers_schema: data.headers_schema,
					params_schema: data.params_schema,
					response_schema: data.response_schema,
					timeout: data.timeout,
					retry_count: data.retry_count,
					is_active: data.is_active,
				});
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["marketplace", profile?.team_id] });
		},
	});
	const installMarketplaceItem = async (input: InstallMarketplaceInput) => await installMarketplaceItemMutation.mutateAsync(input);

	return {
		marketplace,
		isLoading,
		error: error?.message || null,
		fetchMarketplace,
		fetchMarketplaceById,
		installMarketplaceItem,
	};
}
