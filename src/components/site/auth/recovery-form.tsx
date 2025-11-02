"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { RecoveryPasswordInput, recoveryPasswordSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";

export function RecoveryForm() {
	const [email, setEmail] = useState("");
	const [success, setSuccess] = useState(false);
	const { resetPassword, isLoading, error } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RecoveryPasswordInput>({
		resolver: zodResolver(recoveryPasswordSchema),
	});

	const onSubmit = async (data: RecoveryPasswordInput) => {
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
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input id="email" type="email" placeholder="tu@email.com" disabled={isLoading} {...register("email")} />
				{errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
			</div>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				Enviar enlace de recuperación
			</Button>
		</form>
	);
}
