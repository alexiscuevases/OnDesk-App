"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { InviteTeamMemberInput, TeamMember } from "@/lib/validations/team_member";
import { useAuth } from "@/components/providers/auth-provider";

export function useTeamMembers(currentTeamId: string) {
	const { profile } = useAuth();
	const supabase = createClient();
	const queryClient = useQueryClient();

	const {
		data: teamMembers = [],
		isLoading,
		error,
		refetch: fetchTeamMembers,
	} = useQuery<TeamMember[]>({
		queryKey: ["team-members", currentTeamId],
		queryFn: async () => {
			if (!profile) throw new Error("Not authenticated");
			if (!currentTeamId) return [];

			const { data, error: fetchError } = await supabase
				.from("team_members")
				.select("*")
				.eq("team_id", currentTeamId)
				.order("created_at", { ascending: false })
				.returns<TeamMember[]>();
			if (fetchError) throw fetchError;

			return data || [];
		},
		enabled: !!profile && !!currentTeamId,
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
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["team-members", currentTeamId] });
		},
	});
	const inviteTeamMember = async (input: InviteTeamMemberInput) => await inviteTeamMemberMutation.mutateAsync(input);

	const updateTeamMemberRoleMutation = useMutation({
		mutationFn: async ({ id, role }: { id: string; role: TeamMember["role"] }) => {
			if (!profile) throw new Error("Not authenticated");

			const { data, error: updateError } = await supabase.from("team_members").update({ role }).eq("id", id).select().single<TeamMember>();
			if (updateError) throw updateError;

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["team-members", currentTeamId] });
		},
	});
	const updateTeamMemberRole = async (id: string, role: TeamMember["role"]) => await updateTeamMemberRoleMutation.mutateAsync({ id, role });

	const removeTeamMemberMutation = useMutation({
		mutationFn: async (id: string) => {
			if (!profile) throw new Error("Not authenticated");

			const { error: deleteError } = await supabase.from("team_members").delete().eq("id", id);
			if (deleteError) throw deleteError;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["team-members", currentTeamId] });
		},
	});
	const removeTeamMember = async (id: string) => await removeTeamMemberMutation.mutateAsync(id);

	return {
		teamMembers,
		isLoading,
		error: error?.message || null,
		fetchTeamMembers,
		inviteTeamMember,
		updateTeamMemberRole,
		removeTeamMember,
	};
}
