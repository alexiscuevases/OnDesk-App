"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { Marketplace } from "@/lib/validations/marketplace";

export function useMarketplace() {
	const { profile } = useAuth();
	const supabase = createClient();

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

	return {
		marketplace,
		isLoading,
		error: error?.message || null,
		fetchMarketplace,
		fetchMarketplaceById,
	};
}
