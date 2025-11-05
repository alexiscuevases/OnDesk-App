"use client";

import { ConversationsList } from "@/components/dashboard/lists/conversations-list";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CONVERSATION_CHANNELS_OBJECT, CONVERSATION_STATUSES_OBJECT } from "@/lib/constants/conversation";
import { useState } from "react";

export type Filters = {
	status: string;
	channel: string;
};

export default function ConversationsPage() {
	const [filters, setFilters] = useState<Filters>({
		status: "all",
		channel: "all",
	});

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
						<Select value={filters.status} onValueChange={(value) => setFilters((f) => ({ ...f, status: value }))}>
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								{Object.entries(CONVERSATION_STATUSES_OBJECT).map(([key, status]) => (
									<SelectItem value={key}>{status}</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select value={filters.channel} onValueChange={(value) => setFilters((f) => ({ ...f, channel: value }))}>
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="Channel" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Channels</SelectItem>
								{Object.entries(CONVERSATION_CHANNELS_OBJECT).map(([key, channel]) => (
									<SelectItem value={key}>{channel}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Conversations List */}
			<ConversationsList filters={filters} />
		</div>
	);
}
