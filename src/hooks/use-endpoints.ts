"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Endpoint, CreateEndpointInput, UpdateEndpointInput } from "@/lib/validations/endpoint";
import { useAuth } from "@/components/providers/auth-provider";
import { ai } from "@/lib/ai";

export function useEndpoints(agentId?: string) {
	const { profile } = useAuth();
	const supabase = createClient();
	const queryClient = useQueryClient();

	const {
		data: endpoints = [],
		isLoading,
		error,
		refetch: fetchEndpoints,
	} = useQuery({
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

			const { data: endpoint, error: endpointError } = await supabase.from("endpoints").select("*").eq("id", id).single<Endpoint>();
			if (endpointError) throw endpointError;

			const start = Date.now();

			try {
				// Construir la URL con parámetros (para GET, DELETE)
				let url = endpoint.url;
				url = url.replace(/\{(\w+)\}/g, (_, key) => {
					const value = params[key];
					delete params[key];
					return encodeURIComponent(value ?? "");
				});

				if (["GET", "DELETE"].includes(endpoint.method.toUpperCase())) {
					const query = new URLSearchParams(params).toString();
					if (query) url += (url.includes("?") ? "&" : "?") + query;
				}

				// Preparar body (para POST, PUT, PATCH)
				const body = ["POST", "PUT", "PATCH"].includes(endpoint.method.toUpperCase()) ? JSON.stringify(params) : undefined;
				const response = await fetch(url, {
					method: endpoint.method,
					headers: {
						"Content-Type": "application/json",
						...endpoint.headers_schema,
					},
					body,
				});
				if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

				const data = await response.json().catch(() => ({}));
				const duration = Date.now() - start;

				return {
					success: true,
					data,
					duration,
				};
			} catch (err: unknown) {
				const duration = Date.now() - start;
				if (err instanceof Error) return { success: false, error: err.message, duration };
				return { success: false, error: "Unexpected error occurred executing AI action", duration };
			}
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
