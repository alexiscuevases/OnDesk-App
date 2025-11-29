"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/core/supabase/client";
import type { TeamMember } from "@/modules/team/validations/team_member";
import type { CreateTeamInput, Team } from "@/modules/team/validations/team";
import { useAuth } from "@/modules/shared/components/providers/auth-provider";

export function useTeams() {
    const { profile, refreshProfile } = useAuth();
    const supabase = createClient();
    const queryClient = useQueryClient();

    const {
        data: currentTeam = null,
		"use client";

		import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
		import { createClient } from "@/core/supabase/client";
		import type { TeamMember } from "@/modules/team/validations/team_member";
		import type { CreateTeamInput, Team } from "@/modules/team/validations/team";
		import { useAuth } from "@/modules/shared/components/providers/auth-provider";

		export function useTeams() {
			const { profile, refreshProfile } = useAuth();
			const supabase = createClient();
			const queryClient = useQueryClient();

			const {
				data: teams = [],
				isLoading,
				error,
				refetch: fetchTeams,
			} = useQuery<Team[]>({
				queryKey: ["teams", profile?.id],
				queryFn: async () => {
					if (!profile) throw new Error("Not authenticated");

					const { data, error: fetchError } = await supabase
						.from("teams")
						.select("*")
						.order("created_at", { ascending: false });
					if (fetchError) throw fetchError;

					return data || [];
				},
				enabled: !!profile,
			});

			const createTeamMutation = useMutation({
				mutationFn: async (input: CreateTeamInput) => {
					if (!profile) throw new Error("Not authenticated");

					const { data, error: createError } = await supabase
						.from("teams")
						.insert(input)
						.select("*")
						.single<Team>();
					if (createError) throw createError;

					await supabase.from("team_members").insert({ profile_id: profile.id, team_id: data.id, role: "owner" });

					return data;
				},
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["teams", profile?.id] });
					refreshProfile?.();
				},
			});
			const createTeam = async (input: CreateTeamInput) => await createTeamMutation.mutateAsync(input);

			const updateTeamMutation = useMutation({
				mutationFn: async ({ id, input }: { id: string; input: Team }) => {
					if (!profile) throw new Error("Not authenticated");

					const { data, error: updateError } = await supabase.from("teams").update(input).eq("id", id).select().single<Team>();
					if (updateError) throw updateError;

					return data;
				},
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["teams", profile?.id] });
				},
			});
			const updateTeam = async (id: string, input: Team) => await updateTeamMutation.mutateAsync({ id, input });

			return {
				teams,
				isLoading,
				error: error?.message || null,
				fetchTeams,
				createTeam,
				updateTeam,
			};
		}
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
        onSuccess: async () => {
            await refreshProfile();
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
        isLoadingCreateTeam: createTeamMutation.isPending,
        createTeamError: createTeamMutation.error?.message || null,
        switchTeam,
        fetchCurrentTeam,
        fetchTeams,
    };
}
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/core/supabase/client";
import type { TeamMember } from "@/core/validations/team_member";
import type { CreateTeamInput, Team } from "@/core/validations/team";
import { useAuth } from "@/modules/shared/components/providers/auth-provider";

export function useTeams() {
	const { profile, refreshProfile } = useAuth();
	const supabase = createClient();
	const queryClient = useQueryClient();

	const {
		data: currentTeam = null,
		isLoading: isLoadingCurrentTeam,
		error: currentTeamError,
		refetch: fetchCurrentTeam,
	} = useQuery<Team>({
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
	} = useQuery<Team[]>({
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
		onSuccess: async () => {
			await refreshProfile();
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
		isLoadingCreateTeam: createTeamMutation.isPending,
		createTeamError: createTeamMutation.error?.message || null,
		switchTeam,
		fetchCurrentTeam,
		fetchTeams,
	};
}
