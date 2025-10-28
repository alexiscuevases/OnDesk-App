"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Connection, CreateConnectionInput } from "@/lib/validations/connection";

export function useConnections() {
	const [connections, setConnections] = useState<Connection[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const supabase = createClient();

	const fetchConnections = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single();
			if (profileError) throw profileError;

			const { data, error: fetchError } = await supabase
				.from("connections")
				.select("*")
				.eq("team_id", profile.team_id)
				.order("created_at", { ascending: false });

			if (fetchError) throw fetchError;

			setConnections(data || []);
		} catch (err: any) {
			setError(err.message || "Failed to fetch connections");
		} finally {
			setIsLoading(false);
		}
	};

	const createConnection = async (input: CreateConnectionInput) => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

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
				.single();

			if (createError) throw createError;

			await fetchConnections();
			return data;
		} catch (err: any) {
			setError(err.message || "Failed to create connection");
			throw err;
		}
	};

	const updateConnection = async (id: string, input: Partial<Connection>) => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const updateData: any = {};
			if (input.name) updateData.name = input.name;
			if (input.status) updateData.status = input.status;
			if (input.config) updateData.config = input.config;

			const { data, error: updateError } = await supabase.from("connections").update(updateData).eq("id", id).select().single();

			if (updateError) throw updateError;

			await fetchConnections();
			return data;
		} catch (err: any) {
			setError(err.message || "Failed to update connection");
			throw err;
		}
	};

	const deleteConnection = async (id: string) => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { error: deleteError } = await supabase.from("connections").delete().eq("id", id);

			if (deleteError) throw deleteError;

			await fetchConnections();
		} catch (err: any) {
			setError(err.message || "Failed to delete connection");
			throw err;
		}
	};

	useEffect(() => {
		fetchConnections();
	}, []);

	return {
		connections,
		isLoading,
		error,
		fetchConnections,
		createConnection,
		updateConnection,
		deleteConnection,
	};
}
