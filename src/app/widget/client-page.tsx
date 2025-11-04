"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface FloatingChatWidgetProps {
	teamId: string;
}

export default function WidgetClientPage({ teamId }: FloatingChatWidgetProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [showAnimation, setShowAnimation] = useState(false);
	const [showStartConversation, setShowStartConversation] = useState(true);
	const [customerName, setCustomerName] = useState("");
	const [customerEmail, setCustomerEmail] = useState("");
	const [messages, setMessages] = useState<Array<{ id: string; role: string; content: string }>>([]);
	const [input, setInput] = useState("");
	const [isLoadingSend, setIsLoadingSend] = useState(false);

	useEffect(() => {
		setShowAnimation(true);
	}, []);

	useEffect(() => {
		if (isOpen) {
			window.parent.postMessage(
				{
					type: "WIDGET_RESIZE",
					width: "400px",
					height: "600px",
				},
				"*"
			);
		} else {
			window.parent.postMessage(
				{
					type: "WIDGET_RESIZE",
					width: "88px",
					height: "88px",
				},
				"*"
			);
		}
	}, [isOpen]);

	const handleStartConversation = () => {
		if (customerName.trim() && customerEmail.trim()) {
			setShowStartConversation(false);
			setMessages([]);
			setInput("");
		}
	};

	const handleSendMessage = async () => {
		if (!input.trim()) return;

		const userMessage = {
			id: Date.now().toString(),
			role: "user",
			content: input.trim(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoadingSend(true);

		// Simulate API call
		setTimeout(() => {
			const agentMessage = {
				id: (Date.now() + 1).toString(),
				role: "agent",
				content: "Thank you for your message. An agent will respond shortly.",
			};
			setMessages((prev) => [...prev, agentMessage]);
			setIsLoadingSend(false);
		}, 1000);
	};

	return (
		<div className="w-full h-full">
			{/* Floating Button */}
			<div id="widget" className={`fixed bottom-6 right-6 transition-all duration-300 ${showAnimation ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
				<Button
					onClick={() => setIsOpen(!isOpen)}
					size="lg"
					className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-shadow bg-primary text-primary-foreground hover:bg-primary/90">
					{isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
				</Button>
			</div>

			{/* Chat Panel */}
			{isOpen && (
				<div
					className="fixed bottom-24 right-6 transition-all duration-300 transform scale-100 opacity-100"
					style={{
						transformOrigin: "bottom right",
					}}>
					<Card className="w-80 shadow-2xl overflow-hidden flex flex-col h-[500px]">
						{/* Header */}
						<div className="p-4 bg-primary text-primary-foreground">
							<h3 className="font-semibold">Chat Support</h3>
						</div>

						{showStartConversation ? (
							<div className="flex-1 p-4 space-y-4 flex flex-col justify-between">
								<div className="space-y-3">
									<p className="text-sm font-medium">Start a conversation</p>
									<Input placeholder="Your name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="text-sm" />
									<Input
										placeholder="Your email"
										type="email"
										value={customerEmail}
										onChange={(e) => setCustomerEmail(e.target.value)}
										className="text-sm"
									/>
								</div>
								<Button onClick={handleStartConversation} disabled={!customerName.trim() || !customerEmail.trim()} className="w-full">
									Start Chat
								</Button>
							</div>
						) : (
							<>
								<div className="flex-1 overflow-y-auto p-4 space-y-3">
									{messages.length === 0 ? (
										<p className="text-sm text-muted-foreground text-center pt-8">How can we help you today?</p>
									) : (
										messages.map((message) => (
											<div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
												<div
													className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
														message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
													}`}>
													{message.content}
												</div>
											</div>
										))
									)}
								</div>

								{/* Message Input */}
								<Separator />
								<div className="p-4 space-y-2">
									<div className="flex gap-2">
										<Textarea
											placeholder="Type a message..."
											value={input}
											onChange={(e) => setInput(e.target.value)}
											className="min-h-16 resize-none text-sm"
											onKeyDown={(e) => {
												if (e.key === "Enter" && e.ctrlKey) {
													handleSendMessage();
												}
											}}
										/>
										<Button size="icon" onClick={handleSendMessage} disabled={isLoadingSend || !input.trim()} className="shrink-0 h-16">
											<MessageCircle className="h-4 w-4" />
										</Button>
									</div>
									<p className="text-xs text-muted-foreground">Ctrl+Enter to send</p>
								</div>
							</>
						)}
					</Card>
				</div>
			)}

			{/* Overlay */}
			{isOpen && <div className="fixed inset-0 -z-10" onClick={() => setIsOpen(false)} />}
		</div>
	);
}
