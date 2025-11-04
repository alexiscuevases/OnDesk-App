"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgents } from "@/hooks/use-agents";
import { Bot } from "lucide-react";

export function AgentComparison() {
	const { agents, isLoading } = useAgents();

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Comparación de Agentes</CardTitle>
					<CardDescription>Métricas de rendimiento de todos los agentes</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{[1, 2, 3].map((i) => (
						<div key={i} className="space-y-2">
							<div className="flex items-center justify-between">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-4 w-16" />
							</div>
							<Skeleton className="h-2 w-full" />
						</div>
					))}
				</CardContent>
			</Card>
		);
	}

	if (agents.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Comparación de Agentes</CardTitle>
					<CardDescription>Métricas de rendimiento de todos los agentes</CardDescription>
				</CardHeader>
				<CardContent className="p-8 text-center">
					<Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<p className="text-muted-foreground">No hay agentes para comparar</p>
				</CardContent>
			</Card>
		);
	}

	// Calculate mock satisfaction metrics based on agent status and configuration
	const agentsWithMetrics = agents.map((agent) => ({
		name: agent.name,
		status: agent.status,
		satisfaction: agent.status === "active" ? Math.floor(85 + Math.random() * 15) : 0,
		temperature: agent.temperature,
	}));

	return (
		<Card>
			<CardHeader>
				<CardTitle>Comparación de Agentes</CardTitle>
				<CardDescription>Métricas de rendimiento de todos los agentes</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{agentsWithMetrics.map((agent) => (
					<div key={agent.name} className="space-y-2">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">{agent.name}</p>
								<p className="text-sm text-muted-foreground">
									{agent.status === "active" ? "Activo" : "Inactivo"} • Temperature: {agent.temperature}
								</p>
							</div>
							<div className="text-right">
								<p className="font-semibold">{agent.satisfaction}%</p>
								<p className="text-xs text-muted-foreground">rendimiento</p>
							</div>
						</div>
						<Progress value={agent.satisfaction} className="h-2" />
					</div>
				))}
			</CardContent>
		</Card>
	);
}
