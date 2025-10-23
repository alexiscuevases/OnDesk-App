"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Home, Users, MessageSquare, Settings, BarChart3, Plug, Bell } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainNavItems = [
	{ title: "Home", href: "/dashboard", icon: Home },
	{ title: "Agents", href: "/dashboard/agents", icon: Bot },
	{ title: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
	{ title: "Analysis", href: "/dashboard/analysis", icon: BarChart3 },
	{ title: "Notifications", href: "/dashboard/notifications", icon: Bell },
];

const settingsNavItems = [
	{ title: "Connections", href: "/dashboard/connections", icon: Plug },
	{ title: "Team", href: "/dashboard/team", icon: Users },
	{ title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar className="border-none">
			<SidebarHeader className="p-4">
				<Link href="/dashboard" className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
						<Bot className="h-5 w-5 text-sidebar-primary-foreground" />
					</div>
					<span className="text-lg font-semibold">AgentHub</span>
				</Link>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Main</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{mainNavItems.map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton asChild isActive={pathname === item.href}>
										<Link href={item.href}>
											<item.icon className="h-4 w-4" />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Settings</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{settingsNavItems.map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton asChild isActive={pathname === item.href}>
										<Link href={item.href}>
											<item.icon className="h-4 w-4" />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
