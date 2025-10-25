"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Users, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createTeamSchema } from "@/lib/validations/team";
import Link from "next/link";

export default function CreateTeamPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const fromDashboard = searchParams.get("from") === "dashboard";
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			// Validar los datos del formulario
			const validatedData = createTeamSchema.parse(formData);

			const supabase = createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				throw new Error("No autenticado");
			}

			// Crear el team
			const { data: team, error: teamError } = await supabase
				.from("teams")
				.insert({
					owner_id: user.id,
					name: validatedData.name,
					description: validatedData.description || null,
				})
				.select()
				.single();

			if (teamError) throw teamError;

			// Crear el team member para el owner
			const { error: memberError } = await supabase.from("team_members").insert({
				team_id: team.id,
				user_id: user.id,
				email: user.email!,
				role: "owner",
				status: "active",
				invited_by: user.id,
			});

			if (memberError) throw memberError;

			// Actualizar el profile para seleccionar el nuevo team
			await supabase.from("profiles").update({ team_id: team.id }).eq("id", user.id);

			// Si viene del dashboard, regresar al dashboard
			if (fromDashboard) {
				router.push("/dashboard");
			} else {
				// Si es el primer team, ir a select-plan
				router.push(`/select-plan?team_id=${team.id}`);
			}
		} catch (err: any) {
			console.error("Error creando team:", err);
			if (err.errors) {
				// Error de validación de Zod
				setError(err.errors[0].message);
			} else {
				setError(err.message || "Error al crear el equipo. Por favor, intenta de nuevo.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

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
					<form onSubmit={handleSubmit} className="space-y-6">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label htmlFor="name">
								Nombre del equipo <span className="text-destructive">*</span>
							</Label>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="Ej: Mi Empresa"
								value={formData.name}
								onChange={handleChange}
								disabled={isLoading}
								required
								maxLength={100}
							/>
							<p className="text-xs text-muted-foreground">El nombre de tu equipo u organización</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Descripción (opcional)</Label>
							<Textarea
								id="description"
								name="description"
								placeholder="Describe brevemente tu equipo o proyecto..."
								value={formData.description}
								onChange={handleChange}
								disabled={isLoading}
								maxLength={500}
								rows={4}
								className="resize-none"
							/>
							<p className="text-xs text-muted-foreground">Ayuda a tu equipo a entender el propósito del workspace</p>
						</div>

						<div className="flex flex-col gap-3 pt-4">
							<Button type="submit" className="w-full" size="lg" disabled={isLoading || !formData.name.trim()}>
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
