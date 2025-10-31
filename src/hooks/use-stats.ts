"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";

export interface DashboardStats {
	totalConversations: number;
	activeAgents: number;
	avgResponseTime: string;
	satisfactionRate: number;
	conversationsChange: number;
	agentsChange: number;
	responseTimeChange: number;
	satisfactionChange: number;
}

export function useStats() {
	const { profile } = useAuth();
	const supabase = createClient();

	const {
		data: stats = null,
		isLoading,
		error,
		refetch: fetchStats,
	} = useQuery({
		queryKey: ["stats", profile?.team_id],
		queryFn: async () => {
			if (!profile) throw new Error("Not authenticated");

			const { count: conversationsCount } = await supabase
				.from("conversations")
				.select("*", { count: "exact", head: true })
				.eq("team_id", profile.team_id);

			const { count: agentsCount } = await supabase
				.from("agents")
				.select("*", { count: "exact", head: true })
				.eq("team_id", profile.team_id)
				.eq("status", "active");

			return {
				totalConversations: conversationsCount || 0,
				activeAgents: agentsCount || 0,
				avgResponseTime: "2.4s",
				satisfactionRate: 94.5,
				conversationsChange: 12.5,
				agentsChange: 8.2,
				responseTimeChange: -5.3,
				satisfactionChange: 2.1,
			};
		},
		enabled: !!profile,
	});

	return {
		stats,
		isLoading,
		error: error?.message || null,
		fetchStats,
	};
}
