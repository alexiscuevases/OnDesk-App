"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, MoreVertical, MessageCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Conversation } from "@/lib/validations/conversation";
import { useMessages } from "@/hooks/use-messages";
import { Messages, MessagesSkeleton } from "@/components/dashboard/messages";
import { useAuth } from "@/components/providers/auth-provider";
import { useConversations } from "@/hooks/use-conversations";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
	conversation_id: string;
}

export default function SingleConversationClientPage({ conversation_id }: Props) {
	const { profile } = useAuth();
	const { messages } = useMessages(conversation_id);
	const { fetchConversationById } = useConversations();
	const [conversation, setConversation] = useState<Conversation | null>(null);
	const startedAt = conversation?.created_at ? new Date(conversation.created_at).toLocaleString() : "";

	useEffect(() => {
		if (!profile) return;

		(async () => {
			const conv = await fetchConversationById(conversation_id);
			setConversation(conv);
		})();
	}, [profile]);

	if (!conversation)
		return (
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Skeleton className="h-10 w-10 rounded" />
						<div className="flex-1">
							<Skeleton className="h-8 w-48 mb-2" />
							<Skeleton className="h-4 w-32" />
						</div>
					</div>
					<Skeleton className="h-10 w-10 rounded" />
				</div>

				{/* Main Grid */}
				<div className="grid gap-6 lg:grid-cols-3">
					{/* Messages Section */}
					<div className="lg:col-span-2">
						<Card className="p-0">
							<CardContent className="p-0">
								<ScrollArea className="space-y-6 h-[540px] px-4">
									<MessagesSkeleton />
								</ScrollArea>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-4">
						{/* Customer Information Card */}
						<Card>
							<CardContent className="p-6 space-y-4">
								<Skeleton className="h-5 w-32" />
								<div className="flex items-center gap-3">
									<Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
									<div className="flex-1 space-y-2">
										<Skeleton className="h-4 w-28" />
										<Skeleton className="h-3 w-40" />
										<Skeleton className="h-3 w-32" />
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Details Card */}
						<Card>
							<CardContent className="p-6 space-y-4">
								<Skeleton className="h-5 w-20" />
								<div className="space-y-3">
									{Array.from({ length: 5 }).map((_, i) => (
										<div key={i} className="flex items-center justify-between">
											<Skeleton className="h-4 w-20" />
											<Skeleton className="h-4 w-24" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Action Button Card */}
						<Card>
							<CardContent className="p-6">
								<Skeleton className="h-10 w-full rounded" />
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" asChild>
						<Link href="/dashboard/conversations">
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Conversation Details</h1>
						<p className="text-sm text-muted-foreground mt-1">Started {startedAt}</p>
					</div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="icon">
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => setAssignOpen(true)}>Assign to Agent</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive">Delete Conversation</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<Messages conversation={conversation} />
				</div>

				<div className="space-y-4">
					<Card>
						<CardContent className="p-6 space-y-4">
							<h3 className="font-semibold">Customer Information</h3>
							<div className="flex items-center gap-3">
								<Avatar className="h-12 w-12">
									<AvatarImage src={"/placeholder.svg"} alt={conversation?.customer_name || "Customer"} />
									<AvatarFallback>{(conversation?.customer_name || "C").slice(0, 2).toUpperCase()}</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">{conversation?.customer_name || "Unnamed"}</p>
									<p className="text-sm text-muted-foreground">{conversation?.customer_email || ""}</p>
									{conversation?.customer_phone ? <p className="text-sm text-muted-foreground">{conversation.customer_phone}</p> : null}
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6 space-y-4">
							<h3 className="font-semibold">Details</h3>
							<div className="space-y-3 text-sm">
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Status</span>
									<Badge variant="default">{conversation?.status || "pending"}</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Channel</span>
									<Badge variant="outline">{conversation?.channel}</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Agent</span>
									<div className="flex items-center gap-1">
										<Bot className="h-3 w-3" />
										<span>{conversation?.agents?.name || "Unassigned"}</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Messages</span>
									<div className="flex items-center gap-1">
										<MessageCircle className="h-3 w-3" />
										<span>{messages.length}</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Priority</span>
									<Badge variant="secondary">{conversation?.priority || "medium"}</Badge>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6 space-y-2">
							<Button variant="outline" className="w-full bg-transparent" onClick={() => setAssignOpen(true)}>
								Assign / Change Agent
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
