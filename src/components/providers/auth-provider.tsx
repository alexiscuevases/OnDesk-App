"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Profile } from "@/lib/validations/profile";

type AuthContextType = {
	user: User | null;
	profile: Profile | null;
	loading: boolean;
	refreshProfile: () => Promise<void>;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
	user: null,
	profile: null,
	loading: true,
	refreshProfile: async () => {},
	signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const supabase = createClient();
	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchUserAndProfile = async () => {
		setLoading(true);
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			setUser(user);

			const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single<Profile>();
			if (profileError || !profile) throw profileError ?? new Error("Profile not found");

			setProfile(profile);
		} catch (err) {
			console.error("Error fetching user/profile:", err);
			setUser(null);
			setProfile(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			switch (_event) {
				case "INITIAL_SESSION":
					fetchUserAndProfile();
					break;
				case "SIGNED_OUT":
					setUser(null);
					setProfile(null);
					break;

				case "USER_UPDATED":
					if (session?.user) fetchUserAndProfile();
					break;

				default:
					break;
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;

		setUser(null);
		setProfile(null);

		router.push("/auth/sign-in");
		router.refresh();
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				profile,
				loading,
				refreshProfile: fetchUserAndProfile,
				signOut,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within an AuthProvider");
	return context;
};
