"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { UpdatePasswordInput, updatePasswordSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export function UpdatePasswordForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { updatePassword, isLoading, error } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdatePasswordInput>({
		resolver: zodResolver(updatePasswordSchema),
	});

	const onSubmit = async (data: UpdatePasswordInput) => {
		try {
			await updatePassword(data);

			toast.success("Password changed successful", {
				description: "Redirecting...",
			});
		} catch (err) {
			// Error is handled by useAuth hook
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className="space-y-2">
				<Label htmlFor="password">New password</Label>
				<div className="relative">
					<Input
						id="password"
						type={showPassword ? "text" : "password"}
						placeholder="••••••••"
						disabled={isLoading}
						className="pr-10"
						{...register("password")}
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
						{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</button>
				</div>
				{errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="confirm_password">Confirm password</Label>
				<div className="relative">
					<Input
						id="confirm_password"
						type={showConfirmPassword ? "text" : "password"}
						placeholder="••••••••"
						disabled={isLoading}
						className="pr-10"
						{...register("confirm_password")}
					/>
					<button
						type="button"
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
						{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</button>
				</div>
				{errors.confirm_password && <p className="text-sm text-destructive">{errors.confirm_password.message}</p>}
			</div>

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				Update password
			</Button>
		</form>
	);
}
