import { ConversationsList } from "@/components/dashboard/lists/conversations-list";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function ConversationsPage() {
	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
				<p className="text-muted-foreground mt-1">View and manage all customer conversations</p>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="flex flex-col sm:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input placeholder="Search conversations..." className="pl-9" />
					</div>

					<div className="flex gap-2">
						<Select defaultValue="all">
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="resolved">Resolved</SelectItem>
							</SelectContent>
						</Select>
						<Select defaultValue="all">
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="Channel" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Channels</SelectItem>
								<SelectItem value="whatsapp">WhatsApp</SelectItem>
								<SelectItem value="website">Website</SelectItem>
							</SelectContent>
						</Select>
						<Button variant="outline" size="icon">
							<Filter className="h-4 w-4" />
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Conversations List */}
			<ConversationsList />
		</div>
	);
}
