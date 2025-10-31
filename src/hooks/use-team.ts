"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { InviteTeamMemberInput, TeamMember } from "@/lib/validations/team_member";
import type { CreateTeamInput, Team } from "@/lib/validations/team";
import { useAuth } from "@/components/providers/auth-provider";

export function useTeam() {
	const { profile } = useAuth();
	const supabase = createClient();
	const queryClient = useQueryClient();

	const {
		data: currentTeam = null,
		isLoading: isLoadingTeam,
		error: teamError,
		refetch: fetchCurrentTeam,
	} = useQuery({
		queryKey: ["team", profile?.team_id],
		queryFn: async () => {
			if (!profile) throw new Error("Not authenticated");

			const { data: team, error: teamError } = await supabase.from("teams").select("*").eq("id", profile.team_id).single<Team>();
			if (teamError || !team) throw teamError ?? new Error("Team not found");

			return team;
		},
		enabled: !!profile,
	});

	const { data: allTeams = [], refetch: fetchAllTeams } = useQuery({
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

	const {
		data: teamMembers = [],
		isLoading: isLoadingMembers,
		error: membersError,
	} = useQuery({
		queryKey: ["team-members", currentTeam?.id],
		queryFn: async () => {
			if (!profile) throw new Error("Not authenticated");
			if (!currentTeam) return [];

			const { data, error: fetchError } = await supabase
				.from("team_members")
				.select("*")
				.eq("team_id", currentTeam.id)
				.order("created_at", { ascending: false })
				.returns<TeamMember[]>();
			if (fetchError) throw fetchError;

			return data || [];
		},
		enabled: !!profile && !!currentTeam,
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
			if (teamError || !team) throw teamError ?? new Error("Team not created");

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
			queryClient.invalidateQueries({ queryKey: ["team", profile?.team_id] });
			queryClient.invalidateQueries({ queryKey: ["teams", profile?.id] });
		},
	});

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
			queryClient.invalidateQueries({ queryKey: ["team"] });
		},
	});

	const inviteTeamMemberMutation = useMutation({
		mutationFn: async (input: InviteTeamMemberInput) => {
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

			return data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["team-members", variables.team_id] });
		},
	});

	const updateTeamMemberRoleMutation = useMutation({
		mutationFn: async ({ id, role }: { id: string; role: string }) => {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: updateError } = await supabase.from("team_members").update({ role }).eq("id", id).select().single<TeamMember>();
			if (updateError) throw updateError;

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["team-members", currentTeam?.id] });
		},
	});

	const removeTeamMemberMutation = useMutation({
		mutationFn: async ({ id, teamId }: { id: string; teamId?: string }) => {
			if (!profile) throw new Error("Not authenticated");

			const { error: deleteError } = await supabase.from("team_members").delete().eq("id", id);
			if (deleteError) throw deleteError;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["team-members", variables.teamId || currentTeam?.id] });
		},
	});

	const fetchTeamMembers = async (teamId?: string) => {
		await queryClient.invalidateQueries({ queryKey: ["team-members", teamId || currentTeam?.id] });
	};

	return {
		teamMembers,
		currentTeam,
		allTeams,
		isLoading: isLoadingTeam || isLoadingMembers,
		error: teamError?.message || membersError?.message || null,
		createTeam: createTeamMutation.mutateAsync,
		switchTeam: switchTeamMutation.mutateAsync,
		fetchCurrentTeam,
		fetchAllTeams,
		fetchTeamMembers,
		inviteTeamMember: inviteTeamMemberMutation.mutateAsync,
		updateTeamMemberRole: (id: string, role: string) => updateTeamMemberRoleMutation.mutateAsync({ id, role }),
		removeTeamMember: (id: string, teamId?: string) => removeTeamMemberMutation.mutateAsync({ id, teamId }),
	};
}
