"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useAgents } from "@/hooks/use-agents";
import { useTeams } from "@/hooks/use-teams";
import { toast } from "sonner";
import { CreateAgentInput, createAgentSchema } from "@/lib/validations/agent";
import { AGENT_MODELS_OBJECT, AGENT_STATUSES_OBJECT, AGENT_TYPES_OBJECT } from "@/lib/constants/agent";

export function CreateAgentDialog() {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { createAgent } = useAgents();
	const { currentTeam } = useTeams();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm<CreateAgentInput>({
		resolver: zodResolver(createAgentSchema),
	});

	useEffect(() => {
		if (currentTeam?.id) setValue("team_id", currentTeam.id);
	}, [currentTeam, setValue]);

	const onSubmit = async (data: CreateAgentInput) => {
		setIsLoading(true);

		try {
			await createAgent(data);

			toast.success("Agent created", {
				description: "The agent has been successfully created.",
			});

			setOpen(false);
			reset();
		} catch (error: any) {
			toast.error("Error", {
				description: error.message || "Failed to create the agent",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Create Agent
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Create New Agent</DialogTitle>
						<DialogDescription>Configure your AI agent with a name, description, and specialized prompt</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Agent Name</Label>
							<Input id="name" placeholder="e.g., Support Bot" {...register("name")} />
							{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="description">Description</Label>
							<Input id="description" placeholder="Brief description of what this agent does" {...register("description")} />
							{errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="type">Agent Type</Label>
							<Select value={watch("type")} onValueChange={(value) => setValue("type", value as CreateAgentInput["type"])}>
								<SelectTrigger id="type">
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
							<Label htmlFor="system_prompt">System Prompt</Label>
							<Textarea
								id="system_prompt"
								placeholder="You are a helpful customer support agent. Your goal is to..."
								className="min-h-[120px]"
								{...register("system_prompt")}
							/>
							<p className="text-xs text-muted-foreground">This prompt defines the agent’s personality, knowledge, and behavior</p>
							{errors.system_prompt && <p className="text-xs text-destructive">{errors.system_prompt.message}</p>}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="model">AI Model</Label>
							<Select value={watch("model")} onValueChange={(value) => setValue("model", value as CreateAgentInput["model"])}>
								<SelectTrigger id="model">
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
							<Label htmlFor="status">Status</Label>
							<Select value={watch("status")} onValueChange={(value) => setValue("status", value as CreateAgentInput["status"])}>
								<SelectTrigger id="status">
									<SelectValue placeholder="Select the status" />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(AGENT_STATUSES_OBJECT).map(([key, label]) => (
										<SelectItem value={key}>{label}</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								"Create Agent"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
