"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

export function UpdatePasswordForm() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [validationError, setValidationError] = useState<string | null>(null);
	const { updatePassword, isLoading, error } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setValidationError(null);

		// Validate passwords match
		if (password !== confirmPassword) {
			setValidationError("Las contraseñas no coinciden");
			return;
		}

		// Validate password length
		if (password.length < 6) {
			setValidationError("La contraseña debe tener al menos 6 caracteres");
			return;
		}

		try {
			await updatePassword({ password, confirm_password: confirmPassword });
		} catch (err) {
			// Error is handled by useAuth hook
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{(error || validationError) && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error || validationError}</AlertDescription>
				</Alert>
			)}

			<div className="space-y-2">
				<Label htmlFor="password">Nueva contraseña</Label>
				<div className="relative">
					<Input
						id="password"
						type={showPassword ? "text" : "password"}
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						disabled={isLoading}
						className="pr-10"
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
						{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</button>
				</div>
				<p className="text-sm text-muted-foreground">Debe tener al menos 8 caracteres</p>
			</div>

			<div className="space-y-2">
				<Label htmlFor="confirmPassword">Confirmar contraseña</Label>
				<div className="relative">
					<Input
						id="confirmPassword"
						type={showConfirmPassword ? "text" : "password"}
						placeholder="••••••••"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						disabled={isLoading}
						className="pr-10"
					/>
					<button
						type="button"
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
						{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</button>
				</div>
			</div>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading ? "Actualizando..." : "Actualizar contraseña"}
			</Button>
		</form>
	);
}
