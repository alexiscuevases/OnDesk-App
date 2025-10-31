"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Notification } from "@/lib/validations/notification";
import { useAuth } from "@/components/providers/auth-provider";

export function useNotifications() {
	const { profile } = useAuth();
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const supabase = createClient();

	const fetchNotifications = async () => {
		setIsLoading(true);
		setError(null);

		try {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: fetchError } = await supabase
				.from("notifications")
				.select("*")
				.eq("team_id", profile.team_id)
				.order("created_at", { ascending: false })
				.limit(50)
				.returns<Notification[]>();
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
			if (!profile) throw new Error("Not authenticated");

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
			if (!profile) throw new Error("Not authenticated");

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
