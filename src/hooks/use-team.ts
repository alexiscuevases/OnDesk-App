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

			// Obtener el team del usuario
			const { data: teamMember, error: memberError } = await supabase
				.from("team_members")
				.select(
					`
          *,
          teams:team_id (*)
        `
				)
				.eq("user_id", user.id)
				.eq("status", "active")
				.single();

			if (memberError) throw memberError;

			if (teamMember && teamMember.teams) {
				setCurrentTeam(teamMember.teams as Team);
			}
		} catch (err: any) {
			setError(err.message || "Failed to fetch team");
		} finally {
			setIsLoading(false);
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

			setCurrentTeam(team);
			return team;
		} catch (err: any) {
			setError(err.message || "Failed to create team");
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
	}, []);

	return {
		teamMembers,
		currentTeam,
		isLoading,
		error,
		createTeam,
		fetchCurrentTeam,
		fetchTeamMembers,
		inviteTeamMember,
		updateTeamMemberRole,
		removeTeamMember,
	};
}
