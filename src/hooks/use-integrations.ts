"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { Endpoint } from "@/lib/validations/endpoint";
import { CreateIntegrationInput, Integration } from "@/lib/validations/integration";

export function useIntegrations() {
	const { profile } = useAuth();
	const supabase = createClient();
	const queryClient = useQueryClient();

	const {
		data: integrations = [],
		isLoading,
		error,
		refetch: fetchIntegrations,
	} = useQuery<Integration[]>({
		queryKey: ["marketplace", profile?.team_id],
		queryFn: async () => {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: fetchError } = await supabase
				.from("integrations")
				.select("*")
				.order("created_at", { ascending: false })
				.returns<Integration[]>();
			if (fetchError) throw fetchError;

			return data || [];
		},
		enabled: !!profile,
	});

	const createIntegrationMutation = useMutation({
		mutationFn: async (input: CreateIntegrationInput) => {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: integrationError } = await supabase.from("integrations").insert({
				team_id: input.team_id,
				marketplace_id: input.marketplace_id,
				config: input.config,
			});
			if (integrationError) throw integrationError;

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["marketplace", profile?.team_id] });
			queryClient.invalidateQueries({ queryKey: ["integrations", profile?.team_id] });
		},
	});
	const createIntegration = async (input: CreateIntegrationInput) => await createIntegrationMutation.mutateAsync(input);

	return {
		integrations,
		isLoading,
		error: error?.message || null,
		fetchIntegrations,
		createIntegration,
	};
}
