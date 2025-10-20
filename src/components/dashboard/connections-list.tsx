"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Globe, Smartphone, Mail, Check, Plus } from "lucide-react";
import { ConnectIntegrationDialog } from "./connect-integration-dialog";
import { ManageIntegrationDialog } from "./manage-integration-dialog";

const connections = [
	{
		id: "whatsapp",
		name: "WhatsApp Business",
		description: "Connect your agents to WhatsApp for customer messaging",
		icon: MessageCircle,
		status: "connected",
		connectedAccounts: 2,
	},
	{
		id: "website",
		name: "Website Widget",
		description: "Embed a chat widget on your website",
		icon: Globe,
		status: "connected",
		connectedAccounts: 3,
	},
	{
		id: "sms",
		name: "SMS",
		description: "Send and receive SMS messages with your agents",
		icon: Smartphone,
		status: "available",
		connectedAccounts: 0,
	},
	{
		id: "email",
		name: "Email",
		description: "Handle customer emails with AI-powered responses",
		icon: Mail,
		status: "available",
		connectedAccounts: 0,
	},
];

export function ConnectionsList() {
	return (
		<div className="grid gap-4 md:grid-cols-2">
			{connections.map((connection) => (
				<Card key={connection.id}>
					<CardHeader>
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
									<connection.icon className="h-5 w-5 text-primary" />
								</div>
								<div>
									<CardTitle className="text-lg">{connection.name}</CardTitle>
									<Badge variant={connection.status === "connected" ? "default" : "outline"} className="mt-1 text-xs">
										{connection.status === "connected" && <Check className="mr-1 h-3 w-3" />}
										{connection.status === "connected" ? "Connected" : "Available"}
									</Badge>
								</div>
							</div>
						</div>
					</CardHeader>

					<CardContent className="space-y-4">
						<CardDescription className="leading-relaxed">{connection.description}</CardDescription>

						{connection.status === "connected" && (
							<p className="text-sm text-muted-foreground">
								{connection.connectedAccounts} {connection.connectedAccounts === 1 ? "account" : "accounts"} connected
							</p>
						)}

						<div className="flex gap-2">
							{connection.status === "connected" ? (
								<>
									<ManageIntegrationDialog integration={connection}>
										<Button variant="outline" size="sm" className="flex-1 bg-transparent">
											Manage
										</Button>
									</ManageIntegrationDialog>
									<ConnectIntegrationDialog integration={connection}>
										<Button variant="outline" size="sm">
											<Plus className="h-4 w-4" />
										</Button>
									</ConnectIntegrationDialog>
								</>
							) : (
								<ConnectIntegrationDialog integration={connection}>
									<Button size="sm" className="flex-1">
										Connect
									</Button>
								</ConnectIntegrationDialog>
							)}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
