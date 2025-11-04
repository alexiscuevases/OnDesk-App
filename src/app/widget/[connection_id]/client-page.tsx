"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Loader2, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StartConversationInput, startConversationSchema } from "@/lib/validations/widget";
import { useWidget } from "@/hooks/use-widget";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
	connectionId: string;
}

export default function WidgetClientPage({ connectionId }: Props) {
	const {
		messages,
		conversation,
		startConversation,
		startConversationIsLoading,
		startConversationError,
		sendMessage,
		sendMessageIsLoading,
		sendMessageError,
	} = useWidget(connectionId);
	const [isOpen, setIsOpen] = useState(false);
	const [showAnimation, setShowAnimation] = useState(false);
	const [input, setInput] = useState("");

	useEffect(() => {
		setShowAnimation(true);
	}, []);

	useEffect(() => {
		window.parent.postMessage(
			{
				type: "WIDGET_RESIZE",
				width: isOpen ? "calc(384px + 24px)" : "64px",
				height: isOpen ? "calc(624px + 72px + 24px)" : "64px",
			},
			"*"
		);
	}, [isOpen]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<StartConversationInput>({
		resolver: zodResolver(startConversationSchema),
	});

	const onSubmit_StartConversation = async (input: StartConversationInput) => {
		try {
			await startConversation(input);

			setInput("");
		} catch (error) {
			//
		}
	};

	const onSend = async () => {
		try {
			await sendMessage(input.trim());

			setInput("");
		} catch (err: unknown) {
			//
		}
	};

	return (
		<div className="w-full h-full">
			{/* Floating Button */}
			<div id="widget" className={`fixed bottom-0 right-0 transition-all duration-300 ${showAnimation ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
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
					className="fixed bottom-18 right-0 transition-all duration-300 transform scale-100 opacity-100"
					style={{
						transformOrigin: "bottom right",
					}}>
					<Card className="w-96 shadow-2xl overflow-hidden flex flex-col h-156 pt-0">
						{/* Header */}
						<CardHeader className="bg-primary text-primary-foreground flex items-center py-3">
							<h3 className="font-semibold">Chat Support</h3>
						</CardHeader>

						{!conversation ? (
							<>
								<CardContent className="flex-1 space-y-3">
									{startConversationError && (
										<Alert variant="destructive">
											<AlertCircle className="h-4 w-4" />
											<AlertDescription>{startConversationError.message}</AlertDescription>
										</Alert>
									)}

									<p className="text-sm font-medium">Start a conversation</p>
									<div className="space-y-2">
										<Label htmlFor="customer_name">Name</Label>
										<Input
											id="customer_name"
											type="text"
											placeholder="John Doe"
											disabled={startConversationIsLoading}
											{...register("customer_name")}
											className="text-sm"
										/>
										{errors.customer_name && <p className="text-sm text-destructive">{errors.customer_name.message}</p>}
									</div>
									<div className="space-y-2">
										<Label htmlFor="customer_email">Email</Label>
										<Input
											id="customer_email"
											type="text"
											placeholder="tu@email.com"
											disabled={startConversationIsLoading}
											{...register("customer_email")}
											className="text-sm"
										/>
										{errors.customer_email && <p className="text-sm text-destructive">{errors.customer_email.message}</p>}
									</div>
								</CardContent>
								<CardFooter>
									<Button onClick={handleSubmit(onSubmit_StartConversation)} className="w-full">
										{startConversationIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
										Start Chat
									</Button>
								</CardFooter>
							</>
						) : (
							<>
								<CardContent className="flex-1 space-y-3">
									{messages.length === 0 ? (
										<p className="text-sm text-muted-foreground text-center pt-4">How can we help you today?</p>
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
								</CardContent>

								{/* Message Input */}
								<CardFooter className="space-y-2 flex flex-col">
									<div className="flex gap-2 w-full">
										<Textarea
											placeholder="Type a message..."
											className="resize-none text-sm"
											value={input}
											onChange={(e) => setInput(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter" && e.ctrlKey) onSend();
											}}
										/>
										<Button size="icon" className="shrink-0" onClick={onSend} disabled={sendMessageIsLoading}>
											<Send className="h-4 w-4" />
										</Button>
									</div>
									<p className="text-xs text-muted-foreground">Ctrl+Enter to send</p>
								</CardFooter>
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
