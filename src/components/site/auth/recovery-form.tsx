"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function RecoveryForm() {
	const [email, setEmail] = useState("");
	const [success, setSuccess] = useState(false);
	const { resetPassword, isLoading, error } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await resetPassword({ email });

			setSuccess(true);
		} catch (err) {
			// Error is handled by useAuth hook
		}
	};

	if (success) {
		return (
			<Alert>
				<CheckCircle2 className="h-4 w-4" />
				<AlertDescription>
					Te hemos enviado un correo electrónico con las instrucciones para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada.
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					type="email"
					placeholder="tu@email.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					disabled={isLoading}
				/>
				<p className="text-sm text-muted-foreground">Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.</p>
			</div>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
			</Button>
		</form>
	);
}
