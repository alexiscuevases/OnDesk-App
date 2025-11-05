"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversations } from "@/hooks/use-conversations";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { formatDate_DistanceToNow } from "@/lib/utils";

export function RecentConversations() {
	const { conversations, isLoading } = useConversations();

	if (isLoading) {
		return (
			<div className="space-y-4">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
						<Skeleton className="h-9 w-9 rounded-full" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-3 w-full" />
							<Skeleton className="h-4 w-24" />
						</div>
					</div>
				))}
			</div>
		);
	}

	const recentConversations = conversations.slice(0, 5);
	if (recentConversations.length === 0) {
		return (
			<div className="text-center py-8">
				<MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
				<p className="text-sm text-muted-foreground">There are no recent conversations.</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{recentConversations.map((conversation) => {
				const displayName = conversation.customer_name || "Unknown";

				return (
					<Link
						key={conversation.id}
						href={`/dashboard/conversations/${conversation.id}`}
						className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0 hover:opacity-70 transition-opacity">
						<Avatar className="h-9 w-9">
							<AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
						</Avatar>
						<div className="flex-1 space-y-1">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium">{displayName}</p>
								<span className="text-xs text-muted-foreground">{formatDate_DistanceToNow(conversation.created_at)}</span>
							</div>
							{conversation.customer_email && <p className="text-xs text-muted-foreground line-clamp-1">{conversation.customer_email}</p>}
							<div className="flex items-center gap-2">
								<Badge variant="outline" className="text-xs">
									{conversation.channel}
								</Badge>
								<Badge
									variant={conversation.status === "open" ? "default" : conversation.status === "closed" ? "secondary" : "outline"}
									className="text-xs">
									{conversation.status}
								</Badge>
								{conversation.priority && (
									<Badge variant={conversation.priority === "high" ? "destructive" : "outline"} className="text-xs">
										{conversation.priority}
									</Badge>
								)}
							</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
