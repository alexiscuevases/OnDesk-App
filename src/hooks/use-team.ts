"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { InviteTeamMemberInput, CreateTeamInput } from "@/lib/validations/team";

export interface TeamMember {
	id: string;
	team_id: string;
	email: string;
	role: string;
	status: string;
	user_id: string | null;
	invited_by: string;
	created_at: string;
	updated_at: string;
}

export interface Team {
	id: string;
	owner_id: string;
	name: string;
	description: string | null;
	stripe_subscription_id: string | null;
	stripe_subscription_status: string | null;
	plan: string | null;
	created_at: string;
	updated_at: string;
}

export function useTeam() {
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
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			// Obtener el team_id del profile del usuario
			const { data: profile, error: profileError } = await supabase.from("profiles").select("team_id").eq("id", user.id).single();

			if (profileError) throw profileError;

			if (profile?.team_id) {
				// Obtener los detalles del team seleccionado
				const { data: team, error: teamError } = await supabase.from("teams").select("*").eq("id", profile.team_id).single();

				if (teamError) throw teamError;

				setCurrentTeam(team);
			} else {
				setCurrentTeam(null);
			}
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

			// Obtener todos los teams donde el usuario es miembro
			const { data: teamMembers, error: membersError } = await supabase
				.from("team_members")
				.select(
					`
          team_id,
          role,
          teams:team_id (*)
        `
				)
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

			if (teamId) {
				query = query.eq("team_id", teamId);
			} else if (currentTeam) {
				query = query.eq("team_id", currentTeam.id);
			}

			const { data, error: fetchError } = await query;

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
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Not authenticated");

			// Crear el team
			const { data: team, error: teamError } = await supabase
				.from("teams")
				.insert({
					owner_id: user.id,
					name: input.name,
					description: input.description || null,
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

			setCurrentTeam(team);
			await fetchAllTeams();
			return team;
		} catch (err: any) {
			setError(err.message || "Failed to create team");
			throw err;
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
			const { data: teamMember, error: memberError } = await supabase
				.from("team_members")
				.select("*")
				.eq("user_id", user.id)
				.eq("team_id", teamId)
				.eq("status", "active")
				.single();

			if (memberError || !teamMember) throw new Error("No perteneces a este equipo");

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

			const { data, error: createError } = await supabase
				.from("team_members")
				.insert({
					team_id: input.team_id,
					email: input.email,
					role: input.role,
					status: "pending",
					invited_by: user.id,
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

			const { data, error: updateError } = await supabase
				.from("team_members")
				.update({ role, updated_at: new Date().toISOString() })
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
