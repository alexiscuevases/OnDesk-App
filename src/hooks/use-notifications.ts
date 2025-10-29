"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Notification } from "@/lib/validations/notification";
import { Profile } from "@/lib/validations/profile";

export function useNotifications() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const supabase = createClient();

	const fetchNotifications = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { data: profile, error: profileError }: { data: Profile | null; error: any } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", user.id)
				.single();
			if (profileError || !profile) throw profileError ?? new Error("Profile not found");

			const { data, error: fetchError }: { data: Notification[] | null; error: any } = await supabase
				.from("notifications")
				.select("*")
				.eq("team_id", profile.team_id)
				.order("created_at", { ascending: false })
				.limit(50);
			if (fetchError) throw fetchError;

			setNotifications(data || []);
		} catch (err: any) {
			setError(err.message || "Failed to fetch notifications");
		} finally {
			setIsLoading(false);
		}
	};

	const markAsRead = async (id: string) => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { error: updateError } = await supabase.from("notifications").update({ read: true }).eq("id", id);
			if (updateError) throw updateError;

			await fetchNotifications();
		} catch (err: any) {
			setError(err.message || "Failed to mark notification as read");
			throw err;
		}
	};

	const markAllAsRead = async () => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { data: profile, error: profileError }: { data: Profile | null; error: any } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", user.id)
				.single();
			if (profileError || !profile) throw profileError ?? new Error("Profile not found");

			const { error: updateError } = await supabase.from("notifications").update({ read: true }).eq("team_id", profile.team_id).eq("read", false);
			if (updateError) throw updateError;

			await fetchNotifications();
		} catch (err: any) {
			setError(err.message || "Failed to mark all notifications as read");
			throw err;
		}
	};

	const unreadCount = notifications.filter((n) => !n.read).length;

	useEffect(() => {
		fetchNotifications();
	}, []);

	return {
		notifications,
		unreadCount,
		isLoading,
		error,
		fetchNotifications,
		markAsRead,
		markAllAsRead,
	};
}
