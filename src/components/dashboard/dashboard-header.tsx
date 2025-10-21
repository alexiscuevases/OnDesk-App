"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Menu, Loader2 } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function DashboardHeader() {
	const { toggleSidebar } = useSidebar();
	const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();

	// Mostrar solo las 5 notificaciones más recientes
	const recentNotifications = notifications.slice(0, 5);

	const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
		if (!isRead) {
			try {
				await markAsRead(notificationId);
			} catch (error) {
				console.error("Error marking notification as read:", error);
			}
		}
	};

	const handleMarkAllAsRead = async () => {
		try {
			await markAllAsRead();
		} catch (error) {
			console.error("Error marking all as read:", error);
		}
	};

	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-16 items-center gap-4 px-6">
				<Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
					<Menu className="h-5 w-5" />
				</Button>

				<div className="flex-1 flex items-center gap-4">
					<div className="relative w-full max-w-md">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input placeholder="Buscar agentes, conversaciones..." className="pl-9" />
					</div>
				</div>

				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="relative">
								<Bell className="h-5 w-5" />
								{unreadCount > 0 && (
									<Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">{unreadCount}</Badge>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-96">
							<DropdownMenuLabel className="flex items-center justify-between">
								<span>Notificaciones</span>
								<div className="flex items-center gap-2">
									{unreadCount > 0 && (
										<Button
											variant="ghost"
											size="sm"
											className="h-auto p-0 text-xs text-primary"
											onClick={handleMarkAllAsRead}
											disabled={isLoading}>
											Marcar todas como leídas
										</Button>
									)}
									<Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary" asChild>
										<Link href="/dashboard/notifications">Ver todas</Link>
									</Button>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<ScrollArea className="h-[300px]">
								{isLoading ? (
									<div className="flex items-center justify-center py-8">
										<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
									</div>
								) : recentNotifications.length === 0 ? (
									<div className="flex flex-col items-center justify-center py-8 text-center">
										<Bell className="h-8 w-8 text-muted-foreground mb-2" />
										<p className="text-sm text-muted-foreground">No hay notificaciones</p>
									</div>
								) : (
									<div className="space-y-1">
										{recentNotifications.map((notification) => (
											<DropdownMenuItem
												key={notification.id}
												className={`flex-col items-start gap-1 p-3 cursor-pointer ${!notification.read ? "bg-primary/5" : ""}`}
												onClick={() => handleNotificationClick(notification.id, notification.read)}>
												<div className="flex items-center justify-between w-full">
													<p className="text-sm font-medium">{notification.title}</p>
													{!notification.read && (
														<Badge variant="default" className="text-xs">
															Nuevo
														</Badge>
													)}
												</div>
												<p className="text-xs text-muted-foreground">{notification.message}</p>
												<span className="text-xs text-muted-foreground">
													{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: es })}
												</span>
											</DropdownMenuItem>
										))}
									</div>
								)}
							</ScrollArea>
							<DropdownMenuSeparator />
							<div className="p-2">
								<Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
									<Link href="/dashboard/notifications">Ver todas las notificaciones</Link>
								</Button>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
