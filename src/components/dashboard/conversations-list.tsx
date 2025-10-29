"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Clock, Bot } from "lucide-react";
import Link from "next/link";
import { useConversations } from "@/hooks/use-conversations";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function ConversationsList() {
	const { conversations, isLoading, error } = useConversations();

	if (isLoading) {
		return (
			<div className="space-y-4">
				{[1, 2, 3, 4, 5].map((i) => (
					<Card key={i}>
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3 flex-1">
									<Skeleton className="h-10 w-10 rounded-full" />
									<div className="flex-1 space-y-2">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-3 w-48" />
									</div>
								</div>
								<Skeleton className="h-5 w-16" />
							</div>
						</CardHeader>
						<CardContent className="pt-0">
							<Skeleton className="h-4 w-full" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<Card>
				<CardContent className="p-8 text-center">
					<p className="text-destructive">Error: {error}</p>
				</CardContent>
			</Card>
		);
	}

	if (conversations.length === 0) {
		return (
			<Card>
				<CardContent className="p-8 text-center">
					<MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-semibold mb-2">No hay conversaciones todavía</h3>
					<p className="text-muted-foreground">Las conversaciones con clientes aparecerán aquí.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			{conversations.map((conversation) => {
				const initials = conversation.customer_name
					.split(" ")
					.map((n) => n[0])
					.join("")
					.toUpperCase()
					.slice(0, 2);

				return (
					<Card key={conversation.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3 flex-1">
									<Avatar className="h-10 w-10">
										<AvatarFallback>{initials}</AvatarFallback>
									</Avatar>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<h3 className="font-semibold text-sm">{conversation.customer_name}</h3>
											{conversation.status === "open" && (
												<Badge variant="default" className="h-5 px-1.5 text-xs">
													Nuevo
												</Badge>
											)}
										</div>
										<div className="flex items-center gap-2 mt-1 flex-wrap">
											{conversation.customer_email && (
												<span className="text-xs text-muted-foreground">{conversation.customer_email}</span>
											)}
											{conversation.customer_phone && !conversation.customer_email && (
												<span className="text-xs text-muted-foreground">{conversation.customer_phone}</span>
											)}
											<span className="text-xs text-muted-foreground">•</span>
											<Badge variant="outline" className="text-xs">
												{conversation.channel}
											</Badge>
											{conversation.priority && (
												<Badge variant={conversation.priority === "high" ? "destructive" : "outline"} className="text-xs">
													{conversation.priority}
												</Badge>
											)}
										</div>
									</div>
								</div>
								<div className="flex flex-col items-end gap-2">
									<div className="flex items-center gap-1 text-xs text-muted-foreground">
										<Clock className="h-3 w-3" />
										<span>{formatDistanceToNow(new Date(conversation.created_at), { addSuffix: true, locale: es })}</span>
									</div>
									<Badge
										variant={conversation.status === "open" ? "default" : conversation.status === "resolved" ? "secondary" : "outline"}
										className="text-xs">
										{conversation.status}
									</Badge>
								</div>
							</div>
						</CardHeader>
						<CardContent className="pt-0">
							<div className="flex items-center gap-2">
								<Button variant="outline" size="sm" asChild>
									<Link href={`/dashboard/conversations/${conversation.id}`}>
										<MessageSquare className="mr-2 h-3 w-3" />
										Ver Conversación
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
