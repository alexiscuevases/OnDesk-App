"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { InviteTeamMemberInput, TeamMember } from "@/lib/validations/team_member";
import { CreateTeamInput, Team } from "@/lib/validations/team";
import { useAuth } from "@/components/providers/auth-provider";

export function useTeam() {
	const { profile } = useAuth();
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
	const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
	const [allTeams, setAllTeams] = useState<Team[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const supabase = createClient();

	const fetchCurrentTeam = async () => {
		setIsLoading(true);
		setError(null);

		try {
			if (!profile) throw new Error("Not authenticated");

			const { data: team, error: teamError } = await supabase.from("teams").select("*").eq("id", profile.team_id).single<Team>();
			if (teamError || !team) throw teamError ?? new Error("Team not found");

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
			if (!profile) throw new Error("Not authenticated");

			const { data: teamMembers, error: membersError } = await supabase
				.from("team_members")
				.select("*,teams:team_id(*)")
				.eq("user_id", profile.id)
				.eq("status", "active")
				.returns<TeamMember[]>();
			if (membersError) throw membersError;

			const teams = teamMembers.map((teamMember) => teamMember.teams as Team).filter(Boolean) || [];
			setAllTeams(teams);
		} catch (err: any) {
			setError(err.message || "Failed to fetch teams");
		}
	};

	const fetchTeamMembers = async (teamId?: string) => {
		setIsLoading(true);
		setError(null);

		try {
			if (!profile) throw new Error("Not authenticated");

			let query = supabase.from("team_members").select("*").order("created_at", { ascending: false });
			if (teamId) query = query.eq("team_id", teamId);
			else if (currentTeam) query = query.eq("team_id", currentTeam.id);
			const { data, error: fetchError } = await query.returns<TeamMember[]>();
			if (fetchError) throw fetchError;

			setTeamMembers(data || []);
		} catch (err: any) {
			setError(err.message || "Failed to fetch team members");
		} finally {
			setIsLoading(false);
		}
	};

	const createTeam = async (input: CreateTeamInput) => {
		setError(null);

		try {
			if (!profile) throw new Error("Not authenticated");

			// Crear el team
			const { data: team, error: teamError } = await supabase
				.from("teams")
				.insert({
					owner_id: profile.id,
					name: input.name,
					description: input.description,
				})
				.select()
				.single<Team>();
			if (teamError || !team) throw teamError ?? new Error("Team not created");

			// Crear el team member para el owner
			const { error: memberError } = await supabase.from("team_members").insert({
				team_id: team.id,
				invited_by: profile.id,
				user_id: profile.id,
				email: profile.email,
				role: "owner",
				status: "active",
			});
			if (memberError) throw memberError;

			// Actualizar el profile para seleccionar el nuevo team
			await supabase.from("profiles").update({ team_id: team.id }).eq("id", profile.id);

			setCurrentTeam(team);
			await fetchAllTeams();

			return team;
		} catch (err: any) {
			setError(err.message || "Error al crear el equipo. Por favor, intenta de nuevo.");
			throw err;
		}
	};

	const switchTeam = async (teamId: string) => {
		setError(null);

		try {
			if (!profile) throw new Error("Not authenticated");

			// Verificar que el usuario pertenezca a ese team
			const { data: teamMember, error: memberError } = await supabase
				.from("team_members")
				.select("*")
				.eq("user_id", profile.id)
				.eq("team_id", teamId)
				.eq("status", "active")
				.single<TeamMember>();
			if (memberError || !teamMember) throw memberError ?? new Error("No perteneces a este equipo");

			// Actualizar el team_id en el profile
			const { error: updateError } = await supabase.from("profiles").update({ team_id: teamId }).eq("id", profile.id);
			if (updateError) throw updateError;

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
			if (!profile) throw new Error("Not authenticated");

			const { data, error: createError } = await supabase
				.from("team_members")
				.insert({
					invited_by: profile.id,
					team_id: input.team_id,
					email: input.email,
					role: input.role,
				})
				.select()
				.single<TeamMember>();
			if (createError) throw createError;

			await fetchTeamMembers(input.team_id);
			return data;
		} catch (err: any) {
			setError(err.message || "Failed to invite team member");
			throw err;
		}
	};

	const updateTeamMemberRole = async (id: string, role: string) => {
		setError(null);

		try {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: updateError } = await supabase.from("team_members").update({ role }).eq("id", id).select().single<TeamMember>();
			if (updateError) throw updateError;

			await fetchTeamMembers();
			return data;
		} catch (err: any) {
			setError(err.message || "Failed to update team member role");
			throw err;
		}
	};

	const removeTeamMember = async (id: string, teamId?: string) => {
		setError(null);

		try {
			if (!profile) throw new Error("Not authenticated");

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
