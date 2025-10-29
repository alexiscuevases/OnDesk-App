"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Users, TrendingUp, AlertCircle, CheckCircle, Clock, Bell } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const getNotificationIcon = (type: string) => {
	switch (type.toLowerCase()) {
		case "conversation":
			return Bot;
		case "alert":
			return AlertCircle;
		case "team":
			return Users;
		case "success":
			return CheckCircle;
		case "performance":
			return TrendingUp;
		default:
			return Bell;
	}
};

interface NotificationsListProps {
	filter: "all" | "unread";
}

export function NotificationsList({ filter }: NotificationsListProps) {
	const { notifications, isLoading, error, markAsRead } = useNotifications();

	const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

	const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
		if (!isRead) {
			try {
				await markAsRead(notificationId);
			} catch (error) {
				console.error("Error marking notification as read:", error);
			}
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-3">
				{[1, 2, 3, 4].map((i) => (
					<Card key={i}>
						<CardContent className="p-4">
							<div className="flex items-start gap-4">
								<Skeleton className="h-10 w-10 rounded-lg" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-48" />
									<Skeleton className="h-3 w-full" />
									<Skeleton className="h-3 w-24" />
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<Card>
				<CardContent className="p-8 text-center">
					<p className="text-destructive">Error: {error}</p>
				</CardContent>
			</Card>
		);
	}

	if (filteredNotifications.length === 0) {
		return (
			<Card>
				<CardContent className="p-8 text-center">
					<Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<p className="text-muted-foreground">{filter === "unread" ? "No hay notificaciones sin leer" : "No hay notificaciones para mostrar"}</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-3">
			{filteredNotifications.map((notification) => {
				const Icon = getNotificationIcon(notification.type);

				return (
					<Card
						key={notification.id}
						className={`${!notification.read ? "border-primary/50 bg-primary/5" : ""} hover:bg-accent/50 transition-colors cursor-pointer`}
						onClick={() => handleNotificationClick(notification.id, notification.read)}>
						<CardContent className="p-4">
							<div className="flex items-start gap-4">
								<div className={`flex h-10 w-10 items-center justify-center rounded-lg ${!notification.read ? "bg-primary/10" : "bg-muted"}`}>
									<Icon className={`h-5 w-5 ${!notification.read ? "text-primary" : "text-muted-foreground"}`} />
								</div>
								<div className="flex-1 space-y-1">
									<div className="flex items-start justify-between gap-2">
										<div>
											<p className="font-medium text-sm">{notification.title}</p>
											<p className="text-sm text-muted-foreground mt-1">{notification.content}</p>
										</div>
										{!notification.read && (
											<Badge variant="default" className="text-xs">
												Nuevo
											</Badge>
										)}
									</div>
									<div className="flex items-center gap-2 text-xs text-muted-foreground">
										<Clock className="h-3 w-3" />
										<span>{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: es })}</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
