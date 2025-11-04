import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { useMessages } from "@/hooks/use-messages";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AlertCircle, Bot, Check, CheckCheck, Loader2, Send, User } from "lucide-react";
import { Conversation } from "@/lib/validations/conversation";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export const Messages = ({ conversation }: { conversation: Conversation }) => {
	const { messages, isLoading, sendMessage, isLoadingSendMessage } = useMessages(conversation.id);
	const [input, setInput] = useState("");
	const bottomRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length]);

	const onSend = async () => {
		try {
			await sendMessage({ role: "agent", message: input.trim() });

			setInput("");
		} catch (err: unknown) {
			toast.error("Error", {
				description: err instanceof Error ? err.message : "Error al enviar mensaje",
			});
		}
	};

	return (
		<Card className="p-0">
			<CardContent className="p-0">
				<ScrollArea className="space-y-6 h-[540px] px-4">
					{isLoading ? (
						<MessagesSkeleton />
					) : (
						<div className="flex flex-col gap-4">
							{messages.map((message) => {
								const isCustomer = message.role === "user";
								return (
									<div key={message.id} className={`flex gap-3 first-of-type:pt-4 last-of-type:pb-4 ${isCustomer ? "" : "flex-row-reverse"}`}>
										<Avatar className="h-8 w-8">
											{isCustomer ? (
												<>
													<AvatarImage src={"/placeholder.svg"} alt={conversation.customer_name || "Unknown"} />
													<AvatarFallback>{(conversation.customer_name || "C").slice(0, 2).toUpperCase()}</AvatarFallback>
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
														<span className="text-sm font-medium">{conversation.customer_name || "Unknown"}</span>
														<User className="h-3 w-3 text-muted-foreground" />
													</>
												) : (
													<>
														<Bot className="h-3 w-3 text-muted-foreground" />
														<span className="text-sm font-medium">{conversation.agents?.name || "Agent"}</span>
													</>
												)}
											</div>
											<div className="flex flex-col">
												<div
													className={`block-inline max-w-2/3 rounded-lg px-4 py-2 ${
														!isCustomer ? "ml-auto bg-primary text-primary-foreground" : "mr-auto bg-muted text-foreground"
													}`}>
													<p className={`text-sm whitespace-pre-wrap ${!isCustomer ? "text-right" : "text-left"}`}>
														{message.content}
													</p>
												</div>
											</div>
											<div className={`flex items-center gap-2 ${isCustomer ? "justify-start" : "justify-end"}`}>
												<span className="text-xs text-muted-foreground">{formatDate(message.created_at)}</span>
												{!isCustomer && (
													<>
														{message.status === "sent" && <Check className="w-4 h-4" />}
														{message.status === "delivered" && <CheckCheck className="w-4 h-4" />}
														{message.status === "read" && <CheckCheck className="text-primary w-4 h-4" />}
														{message.status === "failed" && <AlertCircle className="text-destructive w-4 h-4" />}
													</>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}

					<span ref={bottomRef} />
				</ScrollArea>

				<div className="border-t border-border p-4">
					<div className="flex gap-2">
						<Textarea placeholder="Type a message..." className="min-h-20 resize-none" value={input} onChange={(e) => setInput(e.target.value)} />
						<Button size="icon" className="shrink-0" onClick={onSend} disabled={isLoadingSendMessage}>
							{isLoadingSendMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export function MessagesSkeleton() {
	return (
		<>
			{/* Message 1 - User */}
			<div className="flex gap-3 first-of-type:pt-4">
				<Skeleton className="h-8 w-8 rounded-full shrink-0" />
				<div className="flex-1 space-y-2">
					<div className="flex items-center gap-2">
						<Skeleton className="h-4 w-24" />
					</div>
					<Skeleton className="h-10 w-2/3 rounded-lg" />
					<Skeleton className="h-3 w-16" />
				</div>
			</div>

			{/* Message 2 - Agent */}
			<div className="flex gap-3 flex-row-reverse">
				<Skeleton className="h-8 w-8 rounded-full shrink-0" />
				<div className="flex-1 space-y-2 text-right">
					<div className="flex items-center gap-2 justify-end">
						<Skeleton className="h-4 w-20" />
					</div>
					<Skeleton className="h-10 w-2/3 ml-auto rounded-lg" />
					<Skeleton className="h-3 w-16 ml-auto" />
				</div>
			</div>

			{/* Message 3 - User */}
			<div className="flex gap-3">
				<Skeleton className="h-8 w-8 rounded-full shrink-0" />
				<div className="flex-1 space-y-2">
					<div className="flex items-center gap-2">
						<Skeleton className="h-4 w-24" />
					</div>
					<Skeleton className="h-16 w-3/4 rounded-lg" />
					<Skeleton className="h-3 w-16" />
				</div>
			</div>

			{/* Message 4 - Agent */}
			<div className="flex gap-3 flex-row-reverse pb-4">
				<Skeleton className="h-8 w-8 rounded-full shrink-0" />
				<div className="flex-1 space-y-2 text-right">
					<div className="flex items-center gap-2 justify-end">
						<Skeleton className="h-4 w-20" />
					</div>
					<Skeleton className="h-12 w-2/3 ml-auto rounded-lg" />
					<Skeleton className="h-3 w-16 ml-auto" />
				</div>
			</div>
		</>
	);
}
