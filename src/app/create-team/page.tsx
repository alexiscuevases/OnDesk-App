"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTeam } from "@/hooks/use-team";
import { CreateTeamInput, createTeamSchema } from "@/lib/validations/team";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CreateTeamPage() {
	const searchParams = useSearchParams();
	const fromDashboard = searchParams.get("from") === "dashboard";
	const { createTeam, isLoading, error } = useTeam();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateTeamInput>({
		resolver: zodResolver(createTeamSchema),
	});

	async function onSubmit(data: CreateTeamInput) {
		try {
			await createTeam(data);
		} catch (err) {
			// Error is handled by useTeam hook
		}
	}

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-6">
			<Card className="w-full max-w-2xl">
				<CardHeader className="text-center">
					{fromDashboard && (
						<div className="flex justify-start mb-4">
							<Button variant="ghost" size="sm" asChild>
								<Link href="/dashboard">
									<ArrowLeft className="h-4 w-4 mr-2" />
									Volver al dashboard
								</Link>
							</Button>
						</div>
					)}
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
						<Users className="h-6 w-6 text-accent" />
					</div>
					<CardTitle className="text-3xl">{fromDashboard ? "Crear nuevo equipo" : "Crea tu equipo"}</CardTitle>
					<CardDescription>
						{fromDashboard
							? "Configura un nuevo espacio de trabajo para tu organización"
							: "Configura tu espacio de trabajo para comenzar a utilizar los agentes de IA"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label htmlFor="name">
								Nombre del equipo <span className="text-destructive">*</span>
							</Label>
							<Input id="name" type="text" placeholder="Ej: Mi Empresa" disabled={isLoading} {...register("name")} />
							<p className="text-xs text-muted-foreground">El nombre de tu equipo u organización</p>
							{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Descripción (opcional)</Label>
							<Textarea
								id="description"
								placeholder="Describe brevemente tu equipo o proyecto..."
								disabled={isLoading}
								{...register("description")}
								className="resize-none"
							/>
							<p className="text-xs text-muted-foreground">Ayuda a tu equipo a entender el propósito del workspace</p>
							{errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
						</div>

						<div className="flex flex-col gap-3 pt-4">
							<Button type="submit" className="w-full" size="lg" disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{fromDashboard ? "Crear equipo" : "Continuar a selección de plan"}
							</Button>
							{!fromDashboard && (
								<p className="text-xs text-center text-muted-foreground">
									Después de crear tu equipo, podrás seleccionar el plan que mejor se adapte a tus necesidades
								</p>
							)}
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
