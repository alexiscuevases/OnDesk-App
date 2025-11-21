"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { CreateIntegrationInput, Integration, UpdateIntegrationInput } from "@/lib/validations/integration";
import { Marketplace } from "@/lib/validations/marketplace";

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
		queryKey: ["integrations", profile?.team_id],
		queryFn: async () => {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: fetchError } = await supabase
				.from("integrations")
				.select("*, marketplace:marketplace_id(*, author:author_id(*))")
				.eq("team_id", profile.team_id)
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

			const { data: marketplace, error: marketplaceError } = await supabase
				.from("marketplace")
				.select("*")
				.eq("id", input.marketplace_id)
				.single<Marketplace>();
			if (marketplaceError) throw marketplaceError;

			const { data: integrationExists } = await supabase
				.from("integrations")
				.select("*")
				.eq("team_id", input.team_id)
				.eq("marketplace_id", input.marketplace_id)
				.single();
			if (integrationExists) throw new Error("Integration already installed");

			const { data: newIntegration, error: integrationError } = await supabase
				.from("integrations")
				.insert({
					team_id: input.team_id,
					marketplace_id: input.marketplace_id,
					config: input.config,
				})
				.select("*")
				.single<Integration>();
			if (integrationError) throw integrationError;

			await supabase
				.from("marketplace")
				.update({
					installs: marketplace.installs + 1,
				})
				.eq("id", input.marketplace_id)
				.single();

			return newIntegration;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["marketplace", profile?.team_id] });
			queryClient.invalidateQueries({ queryKey: ["integrations", profile?.team_id] });
		},
	});
	const createIntegration = async (input: CreateIntegrationInput) => await createIntegrationMutation.mutateAsync(input);

	const updateIntegrationMutation = useMutation({
		mutationFn: async ({ id, input }: { id: string; input: UpdateIntegrationInput }) => {
			if (!profile) throw new Error("Not authenticated");

			const updateData: UpdateIntegrationInput = {};
			if (input.config) updateData.config = input.config;
			if (input.status) updateData.status = input.status;

			const { data, error: updateError } = await supabase.from("integrations").update(updateData).eq("id", id).select().single<Integration>();
			if (updateError) throw updateError;

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["integrations", profile?.team_id] });
		},
	});
	const updateIntegration = async (id: string, input: UpdateIntegrationInput) => await updateIntegrationMutation.mutateAsync({ id, input });

	return {
		integrations,
		isLoading,
		error: error?.message || null,
		fetchIntegrations,
		createIntegration,
		updateIntegration,
	};
}
