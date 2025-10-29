"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { InviteTeamMemberInput, TeamMember } from "@/lib/validations/team_member";
import { CreateTeamInput, Team } from "@/lib/validations/team";
import { useRouter } from "next/navigation";
import { Profile } from "@/lib/validations/profile";

export function useTeam() {
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
	const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
	const [allTeams, setAllTeams] = useState<Team[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const supabase = createClient();

	const fetchCurrentTeam = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { data: profile, error: profileError }: { data: Profile | null; error: any } = await supabase
				.from("profiles")
				.select("*,teams:team_id(*)")
				.eq("id", user.id)
				.single();
			if (profileError || !profile) throw profileError ?? new Error("Profile not found");

			// @ts-expect-error
			const team = profile.teams as Team;
			setCurrentTeam(team);
		} catch (err: any) {
			setError(err.message || "Failed to fetch team");
		} finally {
			setIsLoading(false);
		}
	};

	const fetchAllTeams = async () => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { data: teamMembers, error: membersError }: { data: TeamMember[] | null; error: any } = await supabase
				.from("team_members")
				.select("*,teams:team_id(*)")
				.eq("user_id", user.id)
				.eq("status", "active");
			if (membersError) throw membersError;

			const teams = teamMembers?.map((tm: any) => tm.teams).filter(Boolean) || [];
			setAllTeams(teams);
		} catch (err: any) {
			setError(err.message || "Failed to fetch teams");
		}
	};

	const fetchTeamMembers = async (teamId?: string) => {
		setIsLoading(true);
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			let query = supabase.from("team_members").select("*").order("created_at", { ascending: false });
			if (teamId) query = query.eq("team_id", teamId);
			else if (currentTeam) query = query.eq("team_id", currentTeam.id);
			const { data, error: fetchError }: { data: TeamMember[] | null; error: any } = await query;
			if (fetchError) throw fetchError;

			setTeamMembers(data || []);
		} catch (err: any) {
			setError(err.message || "Failed to fetch team members");
		} finally {
			setIsLoading(false);
		}
	};

	const createTeam = async (input: CreateTeamInput) => {
		setIsLoading(true);
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			// Crear el team
			const { data: team, error: teamError }: { data: Team | null; error: any } = await supabase
				.from("teams")
				.insert({
					owner_id: user.id,
					name: input.name,
					description: input.description,
				})
				.select()
				.single();
			if (teamError || !team) throw teamError ?? new Error("Team not created");

			// Crear el team member para el owner
			const { error: memberError } = await supabase.from("team_members").insert({
				team_id: team.id,
				invited_by: user.id,
				user_id: user.id,
				email: user.email!,
				role: "owner",
				status: "active",
			});
			if (memberError) throw memberError;

			// Actualizar el profile para seleccionar el nuevo team
			await supabase.from("profiles").update({ team_id: team.id }).eq("id", user.id);

			setCurrentTeam(team);
			await fetchAllTeams();

			router.push("/dashboard");
		} catch (err: any) {
			setError(err.message || "Error al crear el equipo. Por favor, intenta de nuevo.");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const switchTeam = async (teamId: string) => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			// Verificar que el usuario pertenezca a ese team
			const { data: teamMember, error: memberError }: { data: TeamMember | null; error: any } = await supabase
				.from("team_members")
				.select("*")
				.eq("user_id", user.id)
				.eq("team_id", teamId)
				.eq("status", "active")
				.single();
			if (memberError || !teamMember) throw memberError ?? new Error("No perteneces a este equipo");

			// Actualizar el team_id en el profile
			const { error: updateError } = await supabase.from("profiles").update({ team_id: teamId }).eq("id", user.id);
			if (updateError) throw updateError;

			// Actualizar el estado local
			await fetchCurrentTeam();
			return true;
		} catch (err: any) {
			setError(err.message || "Failed to switch team");
			throw err;
		}
	};

	const inviteTeamMember = async (input: InviteTeamMemberInput) => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { data, error: createError }: { data: TeamMember | null; error: any } = await supabase
				.from("team_members")
				.insert({
					invited_by: user.id,
					team_id: input.team_id,
					email: input.email,
					role: input.role,
				})
				.select()
				.single();
			if (createError) throw createError;

			await fetchTeamMembers(input.team_id);
			return data;
		} catch (err: any) {
			setError(err.message || "Failed to invite team member");
			throw err;
		}
	};

	const updateTeamMemberRole = async (id: string, role: string, teamId?: string) => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { data, error: updateError }: { data: TeamMember | null; error: any } = await supabase
				.from("team_members")
				.update({ role })
				.eq("id", id)
				.select()
				.single();
			if (updateError) throw updateError;

			await fetchTeamMembers(teamId);
			return data;
		} catch (err: any) {
			setError(err.message || "Failed to update team member role");
			throw err;
		}
	};

	const removeTeamMember = async (id: string, teamId?: string) => {
		setError(null);

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			const { error: deleteError } = await supabase.from("team_members").delete().eq("id", id);
			if (deleteError) throw deleteError;

			await fetchTeamMembers(teamId);
		} catch (err: any) {
			setError(err.message || "Failed to remove team member");
			throw err;
		}
	};

	useEffect(() => {
		fetchCurrentTeam();
		fetchAllTeams();
	}, []);

	return {
		teamMembers,
		currentTeam,
		allTeams,
		isLoading,
		error,
		createTeam,
		switchTeam,
		fetchCurrentTeam,
		fetchAllTeams,
		fetchTeamMembers,
		inviteTeamMember,
		updateTeamMemberRole,
		removeTeamMember,
	};
}
