import { z } from "zod";
import { Team } from "./team";

export const teamMemberSchema = z.object({
	team_id: z.string().min(1, "'Team ID' is required"),
	invited_by: z.string().min(1, "'Invited By' is required"),
	user_id: z.string().optional(),
	email: z.string().email("Invalid email address"),
	role: z.enum(["owner", "admin", "member", "viewer"]),
	status: z.enum(["active", "inactive", "pending"]).optional(),
});

export type TeamMember = z.infer<typeof teamMemberSchema> & {
	id: string;
	teams?: Team;
	created_at: string;
	updated_at: string;
};

/**
 * Invite Team Member
 */
export const inviteTeamMemberSchema = z.object({
	team_id: teamMemberSchema.shape.team_id,
	invited_by: teamMemberSchema.shape.invited_by,
	email: teamMemberSchema.shape.email,
	role: teamMemberSchema.shape.role,
});

export type InviteTeamMemberInput = z.infer<typeof inviteTeamMemberSchema>;
