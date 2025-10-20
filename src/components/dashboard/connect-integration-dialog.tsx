"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ConnectIntegrationDialogProps {
	children: React.ReactNode;
	integration: {
		id: string;
		name: string;
	};
}

export function ConnectIntegrationDialog({ children, integration }: ConnectIntegrationDialogProps) {
	const [open, setOpen] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle connection logic here
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Connect {integration.name}</DialogTitle>
						<DialogDescription>Configure your {integration.name} integration settings</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{integration.id === "whatsapp" && (
							<>
								<div className="space-y-2">
									<Label htmlFor="phone-number">Phone Number</Label>
									<Input id="phone-number" placeholder="+1 (555) 000-0000" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="api-key">WhatsApp Business API Key</Label>
									<Input id="api-key" type="password" placeholder="Enter your API key" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="account-name">Account Name</Label>
									<Input id="account-name" placeholder="My Business Account" />
								</div>
							</>
						)}

						{integration.id === "website" && (
							<>
								<div className="space-y-2">
									<Label htmlFor="website-url">Website URL</Label>
									<Input id="website-url" placeholder="https://example.com" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="widget-name">Widget Name</Label>
									<Input id="widget-name" placeholder="Support Chat" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="agent-select">Default Agent</Label>
									<Select>
										<SelectTrigger id="agent-select">
											<SelectValue placeholder="Select an agent" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="support">Support Bot</SelectItem>
											<SelectItem value="sales">Sales Assistant</SelectItem>
											<SelectItem value="tech">Tech Support</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="welcome-message">Welcome Message</Label>
									<Textarea id="welcome-message" placeholder="Hi! How can I help you today?" />
								</div>
							</>
						)}

						{integration.id === "sms" && (
							<>
								<div className="space-y-2">
									<Label htmlFor="sms-phone">Phone Number</Label>
									<Input id="sms-phone" placeholder="+1 (555) 000-0000" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="sms-provider">SMS Provider</Label>
									<Select>
										<SelectTrigger id="sms-provider">
											<SelectValue placeholder="Select provider" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="twilio">Twilio</SelectItem>
											<SelectItem value="messagebird">MessageBird</SelectItem>
											<SelectItem value="vonage">Vonage</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="sms-api-key">API Key</Label>
									<Input id="sms-api-key" type="password" placeholder="Enter your API key" />
								</div>
							</>
						)}

						{integration.id === "email" && (
							<>
								<div className="space-y-2">
									<Label htmlFor="email-address">Email Address</Label>
									<Input id="email-address" type="email" placeholder="support@example.com" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="smtp-host">SMTP Host</Label>
									<Input id="smtp-host" placeholder="smtp.example.com" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="smtp-port">SMTP Port</Label>
									<Input id="smtp-port" placeholder="587" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="smtp-password">Password</Label>
									<Input id="smtp-password" type="password" placeholder="Enter password" />
								</div>
							</>
						)}
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button type="submit">Connect</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
