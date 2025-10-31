"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Bot, User, Send, MoreVertical, MessageCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useConversations } from "@/hooks/use-conversations";
import type { Conversation } from "@/lib/validations/conversation";
import { useAgents } from "@/hooks/use-agents";
import { useMessages } from "@/hooks/use-messages";
import { useAuth } from "@/components/providers/auth-provider";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Props {
	conversation_id: string;
}

export default function SingleConversationClientPage({ conversation_id }: Props) {
	const { profile } = useAuth();
	const { fetchConversationById, sendMessageByConversationId, assignAgentToConversation } = useConversations();
	const { messages } = useMessages(conversation_id);
	const { agents } = useAgents();
	const [conversation, setConversation] = useState<Conversation | null>(null);
	const [input, setInput] = useState("");
	const [sending, setSending] = useState(false);
	const [assignOpen, setAssignOpen] = useState(false);
	const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
	const bottomRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!profile) return;

		(async () => {
			const conv = await fetchConversationById(conversation_id);
			setConversation(conv);
			setSelectedAgentId(conv?.agent_id ?? null);
		})();
	}, [profile]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length]);

	const currentAgent = useMemo(() => {
		if (!conversation?.agent_id) return null;
		return agents.find((a) => a.id === conversation.agent_id) || null;
	}, [agents, conversation?.agent_id]);

	const onSend = async () => {
		if (!input.trim()) return;
		setSending(true);
		try {
			await sendMessageByConversationId({ conversationId: conversation_id, role: "agent", message: input.trim() });

			setInput("");
		} finally {
			setSending(false);
		}
	};

	const onSaveAgent = async () => {
		if (!selectedAgentId) return;
		await assignAgentToConversation(conversation_id, selectedAgentId);
		const fresh = await fetchConversationById(conversation_id);
		setConversation(fresh);
		setAssignOpen(false);
	};

	const startedAt = conversation?.created_at ? new Date(conversation.created_at).toLocaleString() : "";

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
						<DropdownMenuItem className="text-destructive">Delete Conversation</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2 space-y-4">
					<Card className="p-0">
						<CardContent className="p-0">
							<ScrollArea className="space-y-6 h-[540px] px-4">
								{messages.map((m) => {
									const isCustomer = m.role === "user";
									return (
										<div key={m.id} className={`flex gap-3 first-of-type:pt-4 last-of-type:pb-4 ${isCustomer ? "" : "flex-row-reverse"}`}>
											<Avatar className="h-8 w-8">
												{isCustomer ? (
													<>
														<AvatarImage src={"/placeholder.svg"} alt={conversation?.customer_name || "Unknown"} />
														<AvatarFallback>{(conversation?.customer_name || "C").slice(0, 2).toUpperCase()}</AvatarFallback>
													</>
												) : (
													<>
														<AvatarFallback className="bg-primary/10">
															<Bot className="h-4 w-4 text-primary" />
														</AvatarFallback>
													</>
												)}
											</Avatar>
											<div className={`flex-1 space-y-1 ${!isCustomer ? "text-right" : "text-left"}`}>
												<div className={`flex items-center gap-2 ${!isCustomer ? "justify-end" : "justify-start"}`}>
													{isCustomer ? (
														<>
															<span className="text-sm font-medium">{conversation?.customer_name || "Unknown"}</span>
															<User className="h-3 w-3 text-muted-foreground" />
														</>
													) : (
														<>
															<Bot className="h-3 w-3 text-muted-foreground" />
															<span className="text-sm font-medium">{currentAgent?.name || "Agent"}</span>
														</>
													)}
												</div>
												<div className="flex flex-col">
													<div
														className={`block-inline max-w-2/3 rounded-lg px-4 py-2 ${
															!isCustomer ? "ml-auto bg-primary text-primary-foreground" : "mr-auto bg-muted text-foreground"
														}`}>
														<p className={`text-sm whitespace-pre-wrap ${!isCustomer ? "text-right" : "text-left"}`}>{m.content}</p>
													</div>
												</div>
												<span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleTimeString()}</span>
											</div>
										</div>
									);
								})}

								<span ref={bottomRef} />
							</ScrollArea>

							<div className="border-t border-border p-4">
								<div className="flex gap-2">
									<Textarea
										placeholder="Type a message..."
										className="min-h-20 resize-none"
										value={input}
										onChange={(e) => setInput(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
												e.preventDefault();
												onSend();
											}
										}}
									/>
									<Button size="icon" className="shrink-0" onClick={onSend} disabled={sending || !input.trim()}>
										<Send className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
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
										<span>{currentAgent?.name || "Unassigned"}</span>
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

			{assignOpen ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="bg-background rounded-lg shadow-lg w-[480px] max-w-[95vw] p-6 space-y-4">
						<h3 className="font-semibold text-lg">Assign Agent</h3>
						<div className="max-h-64 overflow-auto space-y-2">
							<button
								className={`w-full text-left px-3 py-2 rounded border ${selectedAgentId === null ? "border-primary" : "border-border"}`}
								onClick={() => setSelectedAgentId(null)}>
								Unassigned
							</button>
							{agents.map((a) => (
								<button
									key={a.id}
									className={`w-full text-left px-3 py-2 rounded border ${selectedAgentId === a.id ? "border-primary" : "border-border"}`}
									onClick={() => setSelectedAgentId(a.id)}>
									{a.name} <span className="text-muted-foreground text-xs">({a.model})</span>
								</button>
							))}
						</div>
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setAssignOpen(false)}>
								Cancel
							</Button>
							<Button onClick={onSaveAgent}>Save</Button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
