"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { baseCreateConnectionInput, baseUpdateConnectionInput, Connection, UpdateConnectionInput } from "@/lib/validations/connection";
import { useAuth } from "@/components/providers/auth-provider";

export function useConnections() {
	const { profile } = useAuth();
	const supabase = createClient();
	const queryClient = useQueryClient();

	const {
		data: connections = [],
		isLoading,
		error,
		refetch: fetchConnections,
	} = useQuery({
		queryKey: ["connections", profile?.team_id],
		queryFn: async () => {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: fetchError }: { data: Connection[] | null; error: any } = await supabase
				.from("connections")
				.select("*")
				.eq("team_id", profile.team_id)
				.order("created_at", { ascending: false });
			if (fetchError) throw fetchError;

			return data || [];
		},
		enabled: !!profile,
	});

	const createConnectionMutation = useMutation({
		mutationFn: async (input: baseCreateConnectionInput) => {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: createError } = await supabase
				.from("connections")
				.insert({
					team_id: input.team_id,
					name: input.name,
					type: input.type,
					status: input.status,
					config: input.config,
				})
				.select()
				.single<Connection>();
			if (createError) throw createError;

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["connections", profile?.team_id] });
		},
	});

	const updateConnectionMutation = useMutation({
		mutationFn: async ({ id, input }: { id: string; input: baseUpdateConnectionInput }) => {
			if (!profile) throw new Error("Not authenticated");

			const updateData: UpdateConnectionInput = {};
			if (input.name) updateData.name = input.name;
			if (input.status) updateData.status = input.status;
			if (input.config) updateData.config = input.config;

			const { data, error: updateError } = await supabase.from("connections").update(updateData).eq("id", id).select().single<Connection>();
			if (updateError) throw updateError;

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["connections", profile?.team_id] });
		},
	});

	const deleteConnectionMutation = useMutation({
		mutationFn: async (id: string) => {
			if (!profile) throw new Error("Not authenticated");

			const { error: deleteError } = await supabase.from("connections").delete().eq("id", id);
			if (deleteError) throw deleteError;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["connections", profile?.team_id] });
		},
	});

	return {
		connections,
		isLoading,
		error: error?.message || null,
		fetchConnections,
		createConnection: createConnectionMutation.mutateAsync,
		updateConnection: updateConnectionMutation.mutateAsync,
		deleteConnection: deleteConnectionMutation.mutateAsync,
	};
}
