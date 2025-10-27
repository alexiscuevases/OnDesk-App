import { z } from "zod";

export const teamMemberSchema = z.object({
	team_id: z.string(),
	invited_by: z.string(),
	user_id: z.string().nullable().optional(),
	email: z.string().email("Email inválido"),
	role: z.enum(["owner", "admin", "member", "viewer"]),
	status: z.enum(["active", "inactive", "pending"]),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
