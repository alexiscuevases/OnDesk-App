import { NotificationsList } from "@/components/dashboard/lists/notifications-list";
import { NotificationsSettings } from "@/components/dashboard/notifications-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NotificationsPage() {
	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
				<p className="text-muted-foreground mt-1">Manage your notifications and alerts</p>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="all" className="space-y-6">
				<TabsList>
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="unread">Unread</TabsTrigger>
					<TabsTrigger value="settings">Settings</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="space-y-4">
					<NotificationsList filter="all" />
				</TabsContent>

				<TabsContent value="unread" className="space-y-4">
					<NotificationsList filter="unread" />
				</TabsContent>

				<TabsContent value="settings" className="space-y-4">
					<NotificationsSettings />
				</TabsContent>
			</Tabs>
		</div>
	);
}
