"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Bot, User, Send, MoreVertical, Clock, MessageCircle } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const conversation = {
	id: "1",
	customer: {
		name: "Alice Johnson",
		email: "alice@example.com",
		avatar: "/placeholder.svg?height=40&width=40",
		initials: "AJ",
	},
	agent: "Support Bot",
	status: "active",
	channel: "WhatsApp",
	startedAt: "Oct 20, 2025 at 2:30 PM",
	messages: [
		{
			id: "1",
			sender: "customer",
			content: "Hi, I'm having trouble setting up my first agent. Can you help?",
			timestamp: "2:30 PM",
		},
		{
			id: "2",
			sender: "agent",
			content:
				"Hello! I'd be happy to help you set up your first agent. Let me guide you through the process. First, could you tell me what type of agent you'd like to create?",
			timestamp: "2:30 PM",
		},
		{
			id: "3",
			sender: "customer",
			content: "I want to create a customer support agent for my e-commerce store.",
			timestamp: "2:31 PM",
		},
		{
			id: "4",
			sender: "agent",
			content:
				"Perfect! A customer support agent is a great choice for e-commerce. Here's what you need to do:\n\n1. Go to the Agents page\n2. Click 'Create Agent'\n3. Choose 'Customer Support' as the type\n4. Customize the prompt with your store's specific information\n5. Connect it to your preferred channels\n\nWould you like me to walk you through each step?",
			timestamp: "2:31 PM",
		},
		{
			id: "5",
			sender: "customer",
			content: "Yes, that would be great! Can you explain more about customizing the prompt?",
			timestamp: "2:32 PM",
		},
		{
			id: "6",
			sender: "agent",
			content:
				"The prompt is where you define your agent's personality and knowledge. You should include:\n\n• Your store's return policy\n• Shipping information\n• Product categories\n• Common FAQs\n• Tone of voice (friendly, professional, etc.)\n\nThe more specific you are, the better your agent will perform. You can always update this later as you learn what works best.",
			timestamp: "2:33 PM",
		},
		{
			id: "7",
			sender: "customer",
			content: "Thank you for your help! That solved my issue.",
			timestamp: "2:35 PM",
		},
	],
};

export default function SingleConversationPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" asChild>
						<Link href="/dashboard/conversations">
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Conversation Details</h1>
						<p className="text-sm text-muted-foreground mt-1">Started {conversation.startedAt}</p>
					</div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="icon">
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>Export Conversation</DropdownMenuItem>
						<DropdownMenuItem>Assign to Agent</DropdownMenuItem>
						<DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-destructive">Delete Conversation</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Conversation Thread */}
				<div className="lg:col-span-2 space-y-4">
					<Card>
						<CardContent className="p-6">
							{/* Messages */}
							<div className="space-y-6 mb-6">
								{conversation.messages.map((message) => (
									<div key={message.id} className={`flex gap-3 ${message.sender === "customer" ? "" : "flex-row-reverse"}`}>
										<Avatar className="h-8 w-8">
											{message.sender === "customer" ? (
												<>
													<AvatarImage src={conversation.customer.avatar || "/placeholder.svg"} alt={conversation.customer.name} />
													<AvatarFallback>{conversation.customer.initials}</AvatarFallback>
												</>
											) : (
												<>
													<AvatarFallback className="bg-primary/10">
														<Bot className="h-4 w-4 text-primary" />
													</AvatarFallback>
												</>
											)}
										</Avatar>
										<div className={`flex-1 space-y-1 ${message.sender === "agent" ? "text-right" : ""}`}>
											<div className="flex items-center gap-2">
												{message.sender === "customer" ? (
													<>
														<span className="text-sm font-medium">{conversation.customer.name}</span>
														<User className="h-3 w-3 text-muted-foreground" />
													</>
												) : (
													<>
														<Bot className="h-3 w-3 text-muted-foreground" />
														<span className="text-sm font-medium">{conversation.agent}</span>
													</>
												)}
												<span className="text-xs text-muted-foreground">{message.timestamp}</span>
											</div>
											<div
												className={`inline-block rounded-lg px-4 py-2 ${
													message.sender === "customer" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
												}`}>
												<p className="text-sm whitespace-pre-wrap text-left">{message.content}</p>
											</div>
										</div>
									</div>
								))}
							</div>

							{/* Input */}
							<div className="border-t border-border pt-4">
								<div className="flex gap-2">
									<Textarea placeholder="Type a message..." className="min-h-[80px] resize-none" />
									<Button size="icon" className="shrink-0">
										<Send className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-4">
					{/* Customer Info */}
					<Card>
						<CardContent className="p-6 space-y-4">
							<h3 className="font-semibold">Customer Information</h3>
							<div className="flex items-center gap-3">
								<Avatar className="h-12 w-12">
									<AvatarImage src={conversation.customer.avatar || "/placeholder.svg"} alt={conversation.customer.name} />
									<AvatarFallback>{conversation.customer.initials}</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">{conversation.customer.name}</p>
									<p className="text-sm text-muted-foreground">{conversation.customer.email}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Conversation Details */}
					<Card>
						<CardContent className="p-6 space-y-4">
							<h3 className="font-semibold">Details</h3>
							<div className="space-y-3 text-sm">
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Status</span>
									<Badge variant="default">{conversation.status}</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Channel</span>
									<Badge variant="outline">{conversation.channel}</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Agent</span>
									<div className="flex items-center gap-1">
										<Bot className="h-3 w-3" />
										<span>{conversation.agent}</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Messages</span>
									<div className="flex items-center gap-1">
										<MessageCircle className="h-3 w-3" />
										<span>{conversation.messages.length}</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Duration</span>
									<div className="flex items-center gap-1">
										<Clock className="h-3 w-3" />
										<span>5 min</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Actions */}
					<Card>
						<CardContent className="p-6 space-y-2">
							<Button variant="outline" className="w-full bg-transparent">
								Assign to Different Agent
							</Button>
							<Button variant="outline" className="w-full bg-transparent">
								Mark as Resolved
							</Button>
							<Button variant="outline" className="w-full text-destructive bg-transparent">
								Close Conversation
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
