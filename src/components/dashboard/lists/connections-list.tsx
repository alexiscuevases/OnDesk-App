"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Globe, Smartphone, Mail, Check, Plus, CheckCircle2 } from "lucide-react";
import { ConnectIntegrationDialog } from "../dialogs/connect-integration-dialog";
import { ManageIntegrationDialog } from "../dialogs/manage-integration-dialog";
import { useConnections } from "@/hooks/use-connections";
import { Connection } from "@/lib/validations/connection";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Integration {
	type: Connection["type"];
	name: string;
	description: string;
	icon: any;
}

const availableIntegrations: Integration[] = [
	{
		type: "whatsapp",
		name: "WhatsApp Business",
		description: "Connect your agents to WhatsApp for customer messaging",
		icon: MessageCircle,
	},
	{
		type: "website",
		name: "Website Widget",
		description: "Embed a chat widget into your website",
		icon: Globe,
	},
	{
		// @ts-expect-error
		type: "sms",
		name: "SMS",
		description: "Send and receive SMS messages with your agents",
		icon: Smartphone,
	},
	{
		// @ts-expect-error
		type: "email",
		name: "Email",
		description: "Handle customer emails with AI-powered responses",
		icon: Mail,
	},
];

export function ConnectionsList() {
	const { connections, isLoading, error } = useConnections();

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2">
				{[1, 2, 3, 4].map((i) => (
					<Card key={i}>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<Skeleton className="h-10 w-10 rounded-lg" />
									<div className="space-y-2">
										<Skeleton className="h-5 w-32" />
										<Skeleton className="h-4 w-20" />
									</div>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-8 w-full" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<Alert>
				<CheckCircle2 className="h-4 w-4" />
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	const connectionsByType = connections.reduce((acc, conn) => {
		const type = conn.type.toLowerCase();
		if (!acc[type]) acc[type] = [];
		acc[type].push(conn);
		return acc;
	}, {} as Record<string, typeof connections>);

	return (
		<div className="grid gap-4 md:grid-cols-2">
			{availableIntegrations.map((integration) => {
				const connectedCount = connectionsByType[integration.type]?.length || 0;
				const isConnected = connectedCount > 0;

				return (
					<Card key={integration.type}>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
										<integration.icon className="h-5 w-5 text-primary" />
									</div>
									<div>
										<CardTitle className="text-lg">{integration.name}</CardTitle>
										<Badge variant={isConnected ? "default" : "outline"} className="mt-1 text-xs">
											{isConnected && <Check className="mr-1 h-3 w-3" />}
											{isConnected ? "Connected" : "Available"}
										</Badge>
									</div>
								</div>
							</div>
						</CardHeader>

						<CardContent className="space-y-4">
							<CardDescription className="leading-relaxed">{integration.description}</CardDescription>

							{isConnected && (
								<p className="text-sm text-muted-foreground">
									{connectedCount} {connectedCount === 1 ? "connected account" : "connected accounts"}
								</p>
							)}

							<div className="flex gap-2">
								{isConnected ? (
									<>
										<ManageIntegrationDialog
											integration={{
												name: integration.name,
												type: integration.type,
											}}
											connections={connectionsByType[integration.type]}>
											<Button variant="outline" size="sm" className="flex-1 bg-transparent">
												Manage
											</Button>
										</ManageIntegrationDialog>
										<ConnectIntegrationDialog
											integration={{
												name: integration.name,
												type: integration.type,
											}}>
											<Button variant="outline" size="sm">
												<Plus className="h-4 w-4" />
											</Button>
										</ConnectIntegrationDialog>
									</>
								) : (
									<ConnectIntegrationDialog
										integration={{
											name: integration.name,
											type: integration.type,
										}}>
										<Button size="sm" className="flex-1">
											Connect
										</Button>
									</ConnectIntegrationDialog>
								)}
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
