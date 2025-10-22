"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Globe, Smartphone, Mail, Check, Plus, Loader2, Plug } from "lucide-react";
import { ConnectIntegrationDialog } from "./dialogs/connect-integration-dialog";
import { ManageIntegrationDialog } from "./dialogs/manage-integration-dialog";
import { useConnections } from "@/hooks/use-connections";

const availableIntegrations = [
	{
		id: "whatsapp",
		name: "WhatsApp Business",
		description: "Conecta tus agentes a WhatsApp para mensajería con clientes",
		icon: MessageCircle,
	},
	{
		id: "website",
		name: "Widget de Sitio Web",
		description: "Integra un widget de chat en tu sitio web",
		icon: Globe,
	},
	{
		id: "sms",
		name: "SMS",
		description: "Envía y recibe mensajes SMS con tus agentes",
		icon: Smartphone,
	},
	{
		id: "email",
		name: "Email",
		description: "Maneja emails de clientes con respuestas impulsadas por IA",
		icon: Mail,
	},
];

const getIntegrationIcon = (type: string) => {
	const integration = availableIntegrations.find((i) => i.id === type.toLowerCase());
	return integration?.icon || Plug;
};

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
			<Card>
				<CardContent className="p-8 text-center">
					<p className="text-destructive">Error: {error}</p>
				</CardContent>
			</Card>
		);
	}

	// Group connections by type to count
	const connectionsByType = connections.reduce((acc, conn) => {
		const type = conn.type.toLowerCase();
		if (!acc[type]) acc[type] = [];
		acc[type].push(conn);
		return acc;
	}, {} as Record<string, typeof connections>);

	return (
		<div className="grid gap-4 md:grid-cols-2">
			{availableIntegrations.map((integration) => {
				const connectedCount = connectionsByType[integration.id]?.length || 0;
				const isConnected = connectedCount > 0;

				return (
					<Card key={integration.id}>
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
											{isConnected ? "Conectado" : "Disponible"}
										</Badge>
									</div>
								</div>
							</div>
						</CardHeader>

						<CardContent className="space-y-4">
							<CardDescription className="leading-relaxed">{integration.description}</CardDescription>

							{isConnected && (
								<p className="text-sm text-muted-foreground">
									{connectedCount} {connectedCount === 1 ? "cuenta conectada" : "cuentas conectadas"}
								</p>
							)}

							<div className="flex gap-2">
								{isConnected ? (
									<>
										<ManageIntegrationDialog integration={integration}>
											<Button variant="outline" size="sm" className="flex-1 bg-transparent">
												Administrar
											</Button>
										</ManageIntegrationDialog>
										<ConnectIntegrationDialog integration={integration}>
											<Button variant="outline" size="sm">
												<Plus className="h-4 w-4" />
											</Button>
										</ConnectIntegrationDialog>
									</>
								) : (
									<ConnectIntegrationDialog integration={integration}>
										<Button size="sm" className="flex-1">
											Conectar
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
