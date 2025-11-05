"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Settings, MoreVertical, Power, Loader2, Trash2, CheckCircle2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfigureAgentDialog } from "../dialogs/configure-agent-dialog";
import { useAgents } from "@/hooks/use-agents";
import { toast } from "sonner";
import { Agent } from "@/lib/validations/agent";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDate_DistanceToNow } from "@/lib/utils";

export function AgentsList() {
	const [configureAgent, setConfigureAgent] = useState<Agent | null>(null);
	const [loadingAction, setLoadingAction] = useState<string | null>(null);
	const { agents, isLoading, error, updateAgent, deleteAgent } = useAgents();

	const handleToggleStatus = async (agent: Agent) => {
		setLoadingAction(agent.id);
		try {
			const newStatus = agent.status === "active" ? "inactive" : "active";
			await updateAgent(agent.id, { status: newStatus });

			toast.success("Updated agent", {
				description: `The agent has been ${newStatus === "active" ? "activated" : "deactivated"} successfully.`,
			});
		} catch (err: any) {
			toast.error("Error", {
				description: err.message || "The agent could not be updated.",
			});
		} finally {
			setLoadingAction(null);
		}
	};

	const handleDeleteAgent = async (agentId: string) => {
		setLoadingAction(agentId);
		try {
			await deleteAgent(agentId);

			toast.success("Agent removed", {
				description: "The agent has been successfully removed.",
			});
		} catch (err: any) {
			toast.error("Error", {
				description: err.message || "The agent could not be removed.",
			});
		} finally {
			setLoadingAction(null);
		}
	};

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3].map((i) => (
					<Card key={i} className="flex flex-col">
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<Skeleton className="h-10 w-10 rounded-lg" />
									<div className="space-y-2">
										<Skeleton className="h-5 w-32" />
										<Skeleton className="h-4 w-16" />
									</div>
								</div>
							</div>
						</CardHeader>
						<CardContent className="flex-1">
							<Skeleton className="h-4 w-full mb-2" />
							<Skeleton className="h-4 w-4/5" />
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

	if (agents.length === 0) {
		return (
			<Card>
				<CardContent className="p-8 text-center">
					<Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-semibold mb-2">There are no agents yet.</h3>
					<p className="text-muted-foreground mb-4">Create your first agent to start automating conversations.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{agents.map((agent) => (
					<Card key={agent.id} className="flex flex-col">
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
										<Bot className="h-5 w-5 text-primary" />
									</div>
									<div>
										<CardTitle className="text-lg">{agent.name}</CardTitle>
										<div className="flex items-center gap-2 mt-1">
											<Badge variant={agent.status === "active" ? "default" : "secondary"} className="text-xs">
												{agent.status}
											</Badge>
											<Badge variant="outline" className="text-xs">
												{agent.type}
											</Badge>
										</div>
									</div>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" disabled={loadingAction === agent.id}>
											{loadingAction === agent.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={() => setConfigureAgent(agent)}>
											<Settings className="mr-2 h-4 w-4" />
											Configure
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => handleToggleStatus(agent)}>
											<Power className="mr-2 h-4 w-4" />
											{agent.status === "active" ? "Deactivate" : "Activate"}
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem variant="destructive" onClick={() => handleDeleteAgent(agent.id)}>
											<Trash2 className="mr-2 h-4 w-4" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</CardHeader>

						<CardContent className="flex-1">
							<CardDescription className="leading-relaxed">{agent.description || "No description"}</CardDescription>

							<div className="mt-4 space-y-2">
								<div className="flex items-center gap-2 text-sm">
									<span className="text-muted-foreground text-xs">Model: {agent.model}</span>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<span className="text-muted-foreground text-xs">
										Temp: {agent.temperature} | Max Tokens: {agent.max_tokens}
									</span>
								</div>
							</div>
						</CardContent>

						<CardFooter className="flex items-center justify-between border-t border-border pt-4">
							<span className="text-xs text-muted-foreground">Since {formatDate_DistanceToNow(agent.created_at)}</span>
							<Button variant="outline" size="sm" onClick={() => setConfigureAgent(agent)}>
								Configure
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>

			{configureAgent && (
				<ConfigureAgentDialog open={!!configureAgent} onOpenChange={(open) => !open && setConfigureAgent(null)} agent={configureAgent} />
			)}
		</>
	);
}
