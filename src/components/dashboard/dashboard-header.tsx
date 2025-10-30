"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Menu, Loader2, Sun, Moon, LogOut } from "lucide-react";
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
import { useTheme } from "next-themes";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "../providers/auth-provider";
import { toast } from "sonner";

export function DashboardHeader() {
	const { toggleSidebar } = useSidebar();
	const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();
	const { setTheme } = useTheme();
	const { signOut, profile, user } = useAuth();

	// Mostrar solo las 5 notificaciones más recientes
	const recentNotifications = notifications.slice(0, 5);

	const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
		if (!isRead) {
			try {
				await markAsRead(notificationId);
			} catch (err: any) {
				toast.error("Error", {
					description: err.message || "No se pudo actualizar la notificación",
				});
			}
		}
	};

	const handleMarkAllAsRead = async () => {
		try {
			await markAllAsRead();
		} catch (err: any) {
			toast.error("Error", {
				description: err.message || "No se pudo actualizar las notificaciones",
			});
		}
	};

	return (
		<header className="flex sticky top-0 z-40 h-16 items-center justify-between gap-4 px-6">
			<div>
				<Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
					<Menu className="h-5 w-5" />
				</Button>
			</div>

			<Card className="p-2">
				<CardContent className="px-0 flex items-center gap-2">
					<div className="relative w-full">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input placeholder="Buscar agentes, conversaciones..." className="pl-9" />
					</div>

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
									<Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs text-primary" asChild>
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
												<p className="text-xs text-muted-foreground">{notification.content}</p>
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

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
								<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
								<span className="sr-only">Toggle theme</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Avatar className="h-8 w-8">
								<AvatarImage src={profile?.avatar_url} alt="User" />
								<AvatarFallback>{profile?.full_name?.charAt(0)}</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>
								<div className="flex items-center gap-3">
									<div className="flex flex-col items-start text-sm">
										<span className="font-medium">{profile?.full_name}</span>
										<span className="text-xs text-muted-foreground">{user?.email}</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href="/dashboard/profile">Profile</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/dashboard/settings">Settings</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem variant="destructive" onClick={signOut}>
								<LogOut className="mr-2 h-4 w-4" />
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardContent>
			</Card>
		</header>
	);
}
