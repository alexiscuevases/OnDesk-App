"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Webhook } from "lucide-react";
import { useAgents } from "@/hooks/use-agents";
import { useEndpoints } from "@/hooks/use-endpoints";
import { toast } from "sonner";
import { Agent, UpdateAgentInput, updateAgentSchema } from "@/lib/validations/agent";
import { ManageEndpointsDialog } from "./manage-endpoints-dialog";
import { AGENT_MODELS_OBJECT, AGENT_STATUSES_OBJECT, AGENT_TYPES_OBJECT } from "@/lib/constants/agent";
import { Slider } from "@/components/ui/slider";

interface ConfigureAgentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	agent: Agent;
}

export function ConfigureAgentDialog({ open, onOpenChange, agent }: ConfigureAgentDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [temperature, setTemperature] = useState(agent.temperature);
	const [showEndpointsDialog, setShowEndpointsDialog] = useState(false);
	const { updateAgent } = useAgents();
	const { endpoints } = useEndpoints(agent.id);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
	} = useForm<UpdateAgentInput>({
		resolver: zodResolver(updateAgentSchema),
		defaultValues: {
			team_id: agent.team_id,
			avatar_url: agent.avatar_url || "",
			name: agent.name,
			description: agent.description,
			type: agent.type,
			model: agent.model,
			system_prompt: agent.system_prompt,
			temperature: agent.temperature,
			max_tokens: agent.max_tokens,
			status: agent.status,
		},
	});

	useEffect(() => {
		reset({
			team_id: agent.team_id,
			avatar_url: agent.avatar_url || "",
			name: agent.name,
			description: agent.description,
			type: agent.type,
			model: agent.model,
			system_prompt: agent.system_prompt,
			temperature: agent.temperature,
			max_tokens: agent.max_tokens,
			status: agent.status,
		});
		setTemperature(agent.temperature);
	}, [agent, reset]);

	const onSubmit = async (data: UpdateAgentInput) => {
		setIsLoading(true);

		try {
			await updateAgent(agent.id, data);

			toast.success("Agent updated", {
				description: "The changes have been successfully saved.",
			});

			onOpenChange(false);
		} catch (err: any) {
			toast.error("Error", {
				description: err.message || "The agent could not be updated",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleTemperatureChange = (value: number[]) => {
		const newValue = value[0];
		setTemperature(newValue);
		setValue("temperature", newValue);
	};

	const activeEndpointsCount = endpoints.filter((e) => e.is_active).length;

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
					<form onSubmit={handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>Configure Agent: {agent.name}</DialogTitle>
							<DialogDescription>Customize your agent's settings and behavior</DialogDescription>
						</DialogHeader>

						<Tabs defaultValue="general" className="w-full">
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="general">General</TabsTrigger>
								<TabsTrigger value="prompt">Prompt</TabsTrigger>
								<TabsTrigger value="endpoints" className="relative">
									Endpoints
									{endpoints.length > 0 && (
										<Badge variant="secondary" className="ml-1.5 h-5 w-5 rounded-full p-0 text-xs">
											{endpoints.length}
										</Badge>
									)}
								</TabsTrigger>
								<TabsTrigger value="advanced">Advanced</TabsTrigger>
							</TabsList>

							<TabsContent value="general" className="space-y-4 mt-4">
								<div className="grid gap-2">
									<Label htmlFor="edit-name">Agent Name</Label>
									<Input id="edit-name" {...register("name")} />
									{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
								</div>
								<div className="grid gap-2">
									<Label htmlFor="edit-description">Description</Label>
									<Input id="edit-description" {...register("description")} />
									{errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
								</div>
								<div className="grid gap-2">
									<Label htmlFor="edit-type">Agent Type</Label>
									<Select value={watch("type")} onValueChange={(value: Agent["type"]) => setValue("type", value)}>
										<SelectTrigger id="edit-type">
											<SelectValue placeholder="Select the agent type" />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(AGENT_TYPES_OBJECT).map(([key, label]) => (
												<SelectItem value={key}>{label}</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
								</div>
								<div className="grid gap-2">
									<Label htmlFor="edit-status">Status</Label>
									<Select value={watch("status")} onValueChange={(value: Agent["status"]) => setValue("status", value)}>
										<SelectTrigger id="edit-status">
											<SelectValue placeholder="Select the agent status" />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(AGENT_STATUSES_OBJECT).map(([key, label]) => (
												<SelectItem value={key}>{label}</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
								</div>
							</TabsContent>

							<TabsContent value="prompt" className="space-y-4 mt-4">
								<div className="grid gap-2">
									<Label htmlFor="edit-prompt">System Prompt</Label>
									<Textarea
										id="edit-prompt"
										placeholder="You are a helpful customer support agent..."
										className="min-h-[200px]"
										{...register("system_prompt")}
									/>
									<p className="text-xs text-muted-foreground">This prompt defines your agent’s personality, knowledge, and behavior.</p>
									{errors.system_prompt && <p className="text-xs text-destructive">{errors.system_prompt.message}</p>}
								</div>
							</TabsContent>

							<TabsContent value="endpoints" className="space-y-4 mt-4">
								<div className="rounded-lg border border-border p-6 space-y-4">
									<div className="flex items-start justify-between">
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<Webhook className="h-5 w-5 text-primary" />
												<h3 className="font-semibold">Agent Actions</h3>
											</div>
											<p className="text-sm text-muted-foreground">
												Configure custom endpoints so your agent can perform actions such as retrieving, creating, updating, or deleting
												external resources.
											</p>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-4 py-4 border-y">
										<div className="space-y-1">
											<p className="text-2xl font-bold">{endpoints.length}</p>
											<p className="text-xs text-muted-foreground">Total endpoints</p>
										</div>
										<div className="space-y-1">
											<p className="text-2xl font-bold text-green-600">{activeEndpointsCount}</p>
											<p className="text-xs text-muted-foreground">Active endpoints</p>
										</div>
									</div>

									<Button type="button" variant="outline" className="w-full" onClick={() => setShowEndpointsDialog(true)}>
										<Webhook className="h-4 w-4 mr-2" />
										Manage Endpoints
									</Button>

									{endpoints.length > 0 && (
										<div className="space-y-2">
											<Label className="text-xs text-muted-foreground">Recent Endpoints</Label>
											<div className="space-y-2">
												{endpoints.slice(0, 3).map((endpoint) => (
													<div key={endpoint.id} className="flex items-center justify-between p-2 rounded-md bg-muted">
														<div className="flex items-center gap-2">
															<Badge
																variant="outline"
																className={`text-xs ${
																	endpoint.method === "GET"
																		? "bg-blue-50 border-blue-200 text-blue-700"
																		: endpoint.method === "POST"
																		? "bg-green-50 border-green-200 text-green-700"
																		: "bg-orange-50 border-orange-200 text-orange-700"
																}`}>
																{endpoint.method}
															</Badge>
															<span className="text-sm">{endpoint.name}</span>
														</div>
														<Badge variant={endpoint.is_active ? "default" : "secondary"} className="text-xs">
															{endpoint.is_active ? "Active" : "Inactive"}
														</Badge>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</TabsContent>

							<TabsContent value="advanced" className="space-y-4 mt-4">
								<div className="grid gap-2">
									<Label htmlFor="edit-model">AI Model</Label>
									<Select value={watch("model")} onValueChange={(value: Agent["model"]) => setValue("model", value)}>
										<SelectTrigger id="edit-model">
											<SelectValue placeholder="Select the AI model" />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(AGENT_MODELS_OBJECT).map(([key, label]) => (
												<SelectItem value={key}>{label}</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
								</div>
								<div className="grid gap-2">
									<Label htmlFor="edit-temperature">Temperature: {temperature.toFixed(1)}</Label>
									<Slider
										id="edit-temperature"
										min={0}
										max={1}
										step={0.1}
										value={[temperature]}
										onValueChange={handleTemperatureChange}
										className="w-full"
									/>
									<p className="text-xs text-muted-foreground">Controls randomness. Lower values make responses more focused.</p>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="edit-max-tokens">Maximum Response Length</Label>
									<Input id="edit-max-tokens" type="number" {...register("max_tokens", { valueAsNumber: true })} />
									<p className="text-xs text-muted-foreground">Maximum number of tokens in the response.</p>
									{errors.max_tokens && <p className="text-xs text-destructive">{errors.max_tokens.message}</p>}
								</div>
							</TabsContent>
						</Tabs>

						<DialogFooter className="mt-4">
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : (
									"Save Changes"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<ManageEndpointsDialog open={showEndpointsDialog} onOpenChange={setShowEndpointsDialog} agentId={agent.id} agentName={agent.name} />
		</>
	);
}
