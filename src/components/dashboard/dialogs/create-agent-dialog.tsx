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
import { useTeam } from "@/hooks/use-team";
import { toast } from "sonner";
import { CreateAgentInput, createAgentSchema } from "@/lib/validations/agent";

export function CreateAgentDialog() {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { createAgent } = useAgents();
	const { currentTeam } = useTeam();

	const form = useForm<CreateAgentInput>({
		resolver: zodResolver(createAgentSchema),
		defaultValues: {
			team_id: "",
			name: "",
			description: "",
			avatar_url: "",
			type: "support",
			model: "gpt-4",
			systemPrompt: "",
			temperature: 0.7,
			maxTokens: 1000,
			status: "active",
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = form;

	useEffect(() => {
		if (currentTeam?.id) {
			setValue("team_id", currentTeam.id);
		}
	}, [currentTeam, setValue]);

	const onSubmit = async (data: CreateAgentInput) => {
		if (!currentTeam?.id) {
			toast.error("Error", {
				description: "Debes seleccionar un equipo antes de crear un agente",
			});
			return;
		}

		setIsLoading(true);
		try {
			await createAgent(data);
			toast.success("Agente creado", {
				description: "El agente ha sido creado exitosamente.",
			});
			setOpen(false);
			reset();
		} catch (error: any) {
			toast.error("Error", {
				description: error.message || "No se pudo crear el agente",
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
					Crear Agente
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Crear Nuevo Agente</DialogTitle>
						<DialogDescription>Configura tu agente de IA con un nombre, descripción y prompt especializado</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Nombre del Agente</Label>
							<Input id="name" placeholder="ej., Bot de Soporte" {...register("name")} />
							{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="description">Descripción</Label>
							<Input id="description" placeholder="Breve descripción de lo que hace este agente" {...register("description")} />
							{errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="type">Tipo de Agente</Label>
							<Select value={watch("type")} onValueChange={(value) => setValue("type", value as CreateAgentInput["type"])}>
								<SelectTrigger id="type">
									<SelectValue placeholder="Selecciona el tipo de agente" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="support">Soporte al Cliente</SelectItem>
									<SelectItem value="sales">Asistente de Ventas</SelectItem>
									<SelectItem value="technical">Soporte Técnico</SelectItem>
									<SelectItem value="onboarding">Guía de Onboarding</SelectItem>
									<SelectItem value="custom">Personalizado</SelectItem>
								</SelectContent>
							</Select>
							{errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="systemPrompt">Prompt del Sistema</Label>
							<Textarea
								id="systemPrompt"
								placeholder="Eres un agente de soporte al cliente útil. Tu objetivo es..."
								className="min-h-[120px]"
								{...register("systemPrompt")}
							/>
							<p className="text-xs text-muted-foreground">Este prompt define la personalidad, conocimiento y comportamiento de tu agente</p>
							{errors.systemPrompt && <p className="text-xs text-destructive">{errors.systemPrompt.message}</p>}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="model">Modelo de IA</Label>
							<Select value={watch("model")} onValueChange={(value) => setValue("model", value as CreateAgentInput["model"])}>
								<SelectTrigger id="model">
									<SelectValue placeholder="Selecciona el modelo de IA" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="gpt-4">GPT-4 (Recomendado)</SelectItem>
								</SelectContent>
							</Select>
							{errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
							Cancelar
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creando...
								</>
							) : (
								"Crear Agente"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
