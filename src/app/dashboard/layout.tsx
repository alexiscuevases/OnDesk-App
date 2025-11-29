import type React from "react";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";
import { DashboardHeader } from "@/modules/dashboard/components/dashboard-header";
import { SidebarProvider } from "@/ui/sidebar";
import { Toaster } from "@/ui/sonner";
import { AuthProvider } from "@/modules/shared/components/providers/auth-provider";

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

