"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { TeamMember } from "@/lib/validations/team_member";
import type { CreateTeamInput, Team } from "@/lib/validations/team";
import { useAuth } from "@/components/providers/auth-provider";

export function useTeams() {
	const { profile } = useAuth();
	const supabase = createClient();
	const queryClient = useQueryClient();

	const {
		data: currentTeam = null,
		isLoading: isLoadingCurrentTeam,
		error: currentTeamError,
		refetch: fetchCurrentTeam,
	} = useQuery({
		queryKey: ["team", profile?.team_id],
		queryFn: async () => {
			if (!profile) throw new Error("Not authenticated");

			const { data: team, error: teamError } = await supabase.from("teams").select("*").eq("id", profile.team_id).single<Team>();
			if (teamError) throw teamError;

			return team;
		},
		enabled: !!profile,
	});

	const {
		data: teams = [],
		isLoading: isLoadingTeams,
		error: teamsError,
		refetch: fetchTeams,
	} = useQuery({
		queryKey: ["teams", profile?.id],
		queryFn: async () => {
			if (!profile) throw new Error("Not authenticated");

			const { data: teamMembers, error: membersError } = await supabase
				.from("team_members")
				.select("*,teams:team_id(*)")
				.eq("user_id", profile.id)
				.eq("status", "active")
				.returns<TeamMember[]>();
			if (membersError) throw membersError;

			const teams = teamMembers.map((teamMember) => teamMember.teams as Team).filter(Boolean) || [];
			return teams;
		},
		enabled: !!profile,
	});

	const createTeamMutation = useMutation({
		mutationFn: async (input: CreateTeamInput) => {
			if (!profile) throw new Error("Not authenticated");

			const { data: team, error: teamError } = await supabase
				.from("teams")
				.insert({
					owner_id: profile.id,
					name: input.name,
					description: input.description,
				})
				.select()
				.single<Team>();
			if (teamError) throw teamError;

			const { error: memberError } = await supabase.from("team_members").insert({
				team_id: team.id,
				invited_by: profile.id,
				user_id: profile.id,
				email: profile.email,
				role: "owner",
				status: "active",
			});
			if (memberError) throw memberError;

			await supabase.from("profiles").update({ team_id: team.id }).eq("id", profile.id);

			return team;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teams", profile?.id] });
		},
	});

	const createTeam = async (input: CreateTeamInput) => await createTeamMutation.mutateAsync(input);

	const switchTeamMutation = useMutation({
		mutationFn: async (teamId: string) => {
			if (!profile) throw new Error("Not authenticated");

			const { data: teamMember, error: memberError } = await supabase
				.from("team_members")
				.select("*")
				.eq("user_id", profile.id)
				.eq("team_id", teamId)
				.eq("status", "active")
				.single<TeamMember>();
			if (memberError || !teamMember) throw memberError ?? new Error("No perteneces a este equipo");

			const { error: updateError } = await supabase.from("profiles").update({ team_id: teamId }).eq("id", profile.id);
			if (updateError) throw updateError;

			return true;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teams"] });
		},
	});

	const switchTeam = async (teamId: string) => await switchTeamMutation.mutateAsync(teamId);

	return {
		currentTeam,
		teams,
		isLoadingCurrentTeam,
		isLoadingTeams,
		currentTeamError: currentTeamError?.message || null,
		teamsError: teamsError?.message || null,
		createTeam,
		createTeamError: createTeamMutation.error?.message || null,
		switchTeam,
		fetchCurrentTeam,
		fetchTeams,
	};
}
