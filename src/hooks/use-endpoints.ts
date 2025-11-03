"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Endpoint, CreateEndpointInput, UpdateEndpointInput } from "@/lib/validations/endpoint";
import { useAuth } from "@/components/providers/auth-provider";
import { endpoints as Endpoints_Service } from "@/lib/services/endpoints";

export function useEndpoints(agentId?: string) {
	const { profile } = useAuth();
	const supabase = createClient();
	const queryClient = useQueryClient();

	const {
		data: endpoints = [],
		isLoading,
		error,
		refetch: fetchEndpoints,
	} = useQuery<Endpoint[]>({
		queryKey: ["endpoints", agentId],
		queryFn: async () => {
			if (!profile) throw new Error("Not authenticated");
			if (!agentId) return [];

			const { data, error: fetchError } = await supabase.from("endpoints").select("*").eq("agent_id", agentId).order("created_at", { ascending: false });
			if (fetchError) throw fetchError;

			return data || [];
		},
		enabled: !!profile && !!agentId,
	});

	const createEndpointMutation = useMutation({
		mutationFn: async (input: CreateEndpointInput) => {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: createError } = await supabase
				.from("endpoints")
				.insert({
					agent_id: input.agent_id,
					name: input.name,
					description: input.description,
					method: input.method,
					url: input.url,
					headers_schema: input.headers_schema,
					params_schema: input.params_schema,
					response_schema: input.response_schema,
					timeout: input.timeout,
					retry_count: input.retry_count,
					is_active: input.is_active,
				})
				.select("*")
				.single<Endpoint>();
			if (createError) throw createError;

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["endpoints", agentId] });
		},
	});
	const createEndpoint = async (input: CreateEndpointInput) => await createEndpointMutation.mutateAsync(input);

	const updateEndpointMutation = useMutation({
		mutationFn: async ({ id, input }: { id: string; input: UpdateEndpointInput }) => {
			if (!profile) throw new Error("Not authenticated");

			const updateData: UpdateEndpointInput = {};
			if (input.name) updateData.name = input.name;
			if (input.description) updateData.description = input.description;
			if (input.method) updateData.method = input.method;
			if (input.url) updateData.url = input.url;
			if (input.headers_schema) updateData.headers_schema = input.headers_schema;
			if (input.params_schema) updateData.params_schema = input.params_schema;
			if (input.response_schema) updateData.response_schema = input.response_schema;
			if (input.timeout !== undefined) updateData.timeout = input.timeout;
			if (input.retry_count !== undefined) updateData.retry_count = input.retry_count;
			if (input.is_active !== undefined) updateData.is_active = input.is_active;

			const { data, error: updateError } = await supabase.from("endpoints").update(updateData).eq("id", id).select("*").single<Endpoint>();
			if (updateError) throw updateError;

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["endpoints", agentId] });
		},
	});
	const updateEndpoint = async (id: string, input: UpdateEndpointInput) => await updateEndpointMutation.mutateAsync({ id, input });

	const deleteEndpointMutation = useMutation({
		mutationFn: async (id: string) => {
			if (!profile) throw new Error("Not authenticated");

			const { error: deleteError } = await supabase.from("endpoints").delete().eq("id", id);
			if (deleteError) throw deleteError;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["endpoints", agentId] });
		},
	});
	const deleteEndpoint = async (id: string) => await deleteEndpointMutation.mutateAsync(id);

	const testEndpointMutation = useMutation({
		mutationFn: async ({ id, params }: { id: string; params?: any }) => {
			if (!profile) throw new Error("Not authenticated");

			const response = await Endpoints_Service.executor(id, params);
			if (response.success) return response.data;
			throw new Error(response.error);
		},
	});
	const testEndpoint = async (id: string, params?: any) => await testEndpointMutation.mutateAsync({ id, params });

	return {
		endpoints,
		isLoading,
		error: error?.message || null,
		fetchEndpoints,
		createEndpoint,
		updateEndpoint,
		deleteEndpoint,
		testEndpoint,
		isTestingEndpoint: testEndpointMutation.isPending,
	};
}
