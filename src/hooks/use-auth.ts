"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ResetPasswordInput, SignInInput, SignUpInput, UpdatePasswordInput } from "@/lib/validations/auth";
import { AppConfigs } from "@/configs/app";

export function useAuth() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const supabase = createClient();

	const signIn = async (data: SignInInput) => {
		setIsLoading(true);
		setError(null);

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email: data.email,
				password: data.password,
			});
			if (error) throw error;

			router.push("/dashboard");
			router.refresh();
		} catch (err: any) {
			setError(err.message || "An error occurred during sign in");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const signUp = async (data: SignUpInput) => {
		setIsLoading(true);
		setError(null);

		try {
			const { error: authError } = await supabase.auth.signUp({
				email: data.email,
				password: data.password,
				options: {
					emailRedirectTo: `${AppConfigs.url}/select-plan`,
					data: {
						full_name: data.full_name,
						company_name: data.company_name,
					},
				},
			});
			if (authError) throw authError;

			router.push("/auth/sign-up/success");
		} catch (err: any) {
			setError(err.message || "An error occurred during sign up");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const resetPassword = async (data: ResetPasswordInput) => {
		setIsLoading(true);
		setError(null);

		try {
			const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
				redirectTo: `${AppConfigs.url}/auth/update-password`,
			});
			if (error) throw error;

			return true;
		} catch (err: any) {
			setError(err.message || "Ocurrió un error al enviar el correo de recuperación");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const updatePassword = async (data: UpdatePasswordInput) => {
		setIsLoading(true);
		setError(null);

		try {
			const { error } = await supabase.auth.updateUser({
				password: data.password,
			});
			if (error) throw error;

			router.push("/auth/sign-in");
			router.refresh();
		} catch (err: any) {
			setError(err.message || "Ocurrió un error al actualizar la contraseña");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		signIn,
		signUp,
		resetPassword,
		updatePassword,
		isLoading,
		error,
	};
}
