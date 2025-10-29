"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { SignInInput, SignUpInput } from "@/lib/validations/auth";
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

			// Show success message
			router.push("/auth/sign-up/success");
		} catch (err: any) {
			setError(err.message || "An error occurred during sign up");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		signIn,
		signUp,
		isLoading,
		error,
	};
}
