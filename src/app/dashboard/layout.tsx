import type React from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/auth-provider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthProvider>
			<SidebarProvider>
				<div className="flex min-h-screen w-full">
					<DashboardSidebar />
					<div className="flex flex-1 flex-col">
						<DashboardHeader />
						<main className="flex-1 p-6 md:p-8">{children}</main>
					</div>
				</div>
				<Toaster />
			</SidebarProvider>
		</AuthProvider>
	);
}
