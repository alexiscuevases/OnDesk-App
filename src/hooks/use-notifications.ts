"use client";

import { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/lib/validations/notification";
import { useAuth } from "@/components/providers/auth-provider";

export function useNotifications(fromDashboardHeader = false) {
	const { profile } = useAuth();
	const supabase = createClient();
	const queryClient = useQueryClient();

	const {
		data: notifications = [],
		isLoading,
		error,
		refetch: fetchNotifications,
	} = useQuery<Notification[]>({
		queryKey: ["notifications", profile?.team_id],
		queryFn: async () => {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: fetchError } = await supabase
				.from("notifications")
				.select("*")
				.eq("team_id", profile.team_id)
				.order("created_at", { ascending: false })
				.limit(50)
				.returns<Notification[]>();
			if (fetchError) throw fetchError;

			return data || [];
		},
		enabled: !!profile,
	});

	const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

	const markAsReadMutation = useMutation({
		mutationFn: async (id: string) => {
			if (!profile) throw new Error("Not authenticated");

			const { error: updateError } = await supabase.from("notifications").update({ read: true }).eq("id", id);
			if (updateError) throw updateError;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications", profile?.team_id] });
		},
	});
	const markAsRead = async (id: string) => await markAsReadMutation.mutateAsync(id);

	const markAllAsReadMutation = useMutation({
		mutationFn: async () => {
			if (!profile) throw new Error("Not authenticated");

			const { error: updateError } = await supabase.from("notifications").update({ read: true }).eq("team_id", profile.team_id).eq("read", false);
			if (updateError) throw updateError;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications", profile?.team_id] });
		},
	});
	const markAllAsRead = async () => await markAllAsReadMutation.mutateAsync();

	useEffect(() => {
		if (!profile) return;

		const notificationsChannel = supabase
			.channel(fromDashboardHeader ? "notifications-changes-header" : "notifications-changes-page")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "notifications",
					filter: `team_id=eq.${profile.team_id}`,
				},
				(payload) => {
					if (payload.eventType === "INSERT") {
						queryClient.setQueryData<Notification[]>(["notifications", profile.team_id], (old = []) => {
							const newNotification = payload.new as Notification;
							const exists = old.some((n) => n.id === newNotification.id);
							if (exists) return old.map((n) => (n.id === newNotification.id ? newNotification : n));
							return [newNotification, ...old];
						});
					} else if (payload.eventType === "UPDATE") {
						queryClient.setQueryData<Notification[]>(["notifications", profile.team_id], (old = []) =>
							old.map((conv) => (conv.id === payload.new.id ? (payload.new as Notification) : conv))
						);
					} else if (payload.eventType === "DELETE") {
						queryClient.setQueryData<Notification[]>(["notifications", profile.team_id], (old = []) =>
							old.filter((conv) => conv.id !== payload.old.id)
						);
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(notificationsChannel);
		};
	}, [profile, queryClient]);

	return {
		notifications,
		unreadCount,
		isLoading,
		error: error?.message || null,
		fetchNotifications,
		markAsRead,
		markAllAsRead,
	};
}
