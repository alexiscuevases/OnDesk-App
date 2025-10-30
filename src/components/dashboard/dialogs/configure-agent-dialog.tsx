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
import { Loader2 } from "lucide-react";
import { useAgents } from "@/hooks/use-agents";
import { toast } from "sonner";
import { Agent, UpdateAgentInput, updateAgentSchema } from "@/lib/validations/agent";

interface ConfigureAgentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	agent: Agent;
}

export function ConfigureAgentDialog({ open, onOpenChange, agent }: ConfigureAgentDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [temperature, setTemperature] = useState(agent.temperature);
	const { updateAgent } = useAgents();

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

			toast.success("Agente actualizado", {
				description: "Los cambios han sido guardados exitosamente.",
			});

			onOpenChange(false);
		} catch (err: any) {
			toast.error("Error", {
				description: err.message || "No se pudo actualizar el agente",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseFloat(e.target.value);
		setTemperature(value);
		setValue("temperature", value);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Configurar Agente: {agent.name}</DialogTitle>
						<DialogDescription>Personaliza la configuración y comportamiento de tu agente</DialogDescription>
					</DialogHeader>

					<Tabs defaultValue="general" className="w-full">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="general">General</TabsTrigger>
							<TabsTrigger value="prompt">Prompt</TabsTrigger>
							<TabsTrigger value="advanced">Avanzado</TabsTrigger>
						</TabsList>

						<TabsContent value="general" className="space-y-4 mt-4">
							<div className="grid gap-2">
								<Label htmlFor="edit-name">Nombre del Agente</Label>
								<Input id="edit-name" {...register("name")} />
								{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-description">Descripción</Label>
								<Input id="edit-description" {...register("description")} />
								{errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-type">Tipo de Agente</Label>
								<Select value={watch("type")} onValueChange={(value: Agent["type"]) => setValue("type", value)}>
									<SelectTrigger id="edit-type">
										<SelectValue placeholder="Selecciona el tipo de agente" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="sales">Asistente de Ventas</SelectItem>
										<SelectItem value="support">Soporte al Cliente</SelectItem>
										<SelectItem value="general">General</SelectItem>
									</SelectContent>
								</Select>
								{errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-status">Status</Label>
								<Select value={watch("status")} onValueChange={(value: Agent["status"]) => setValue("status", value)}>
									<SelectTrigger id="edit-status">
										<SelectValue placeholder="Selecciona el tipo de agente" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="inactive">Inactive</SelectItem>
										<SelectItem value="training">Training</SelectItem>
									</SelectContent>
								</Select>
								{errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
							</div>
						</TabsContent>

						<TabsContent value="prompt" className="space-y-4 mt-4">
							<div className="grid gap-2">
								<Label htmlFor="edit-prompt">Prompt del Sistema</Label>
								<Textarea
									id="edit-prompt"
									placeholder="Eres un agente de soporte al cliente útil..."
									className="min-h-[200px]"
									{...register("system_prompt")}
								/>
								<p className="text-xs text-muted-foreground">Este prompt define la personalidad, conocimiento y comportamiento de tu agente</p>
								{errors.system_prompt && <p className="text-xs text-destructive">{errors.system_prompt.message}</p>}
							</div>
						</TabsContent>

						<TabsContent value="advanced" className="space-y-4 mt-4">
							<div className="grid gap-2">
								<Label htmlFor="edit-model">Modelo de IA</Label>
								<Select value={watch("model")} onValueChange={(value: Agent["model"]) => setValue("model", value)}>
									<SelectTrigger id="edit-model">
										<SelectValue placeholder="Selecciona el modelo de IA" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="gpt-4">GPT-4 (Recomendado)</SelectItem>
									</SelectContent>
								</Select>
								{errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-temperature">Temperature: {temperature.toFixed(1)}</Label>
								<input
									type="range"
									id="edit-temperature"
									min="0"
									max="1"
									step="0.1"
									value={temperature}
									onChange={handleTemperatureChange}
									className="w-full"
								/>
								<p className="text-xs text-muted-foreground">Controla la aleatoriedad. Valores más bajos hacen las respuestas más enfocadas</p>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="edit-max-tokens">Longitud Máxima de Respuesta</Label>
								<Input id="edit-max-tokens" type="number" {...register("max_tokens", { valueAsNumber: true })} />
								<p className="text-xs text-muted-foreground">Número máximo de tokens en la respuesta</p>
								{errors.max_tokens && <p className="text-xs text-destructive">{errors.max_tokens.message}</p>}
							</div>
						</TabsContent>
					</Tabs>

					<DialogFooter className="mt-4">
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
							Cancelar
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Guardando...
								</>
							) : (
								"Guardar Cambios"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
