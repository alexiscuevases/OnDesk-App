import { z } from "zod";
import { Team } from "./team";

export const teamMemberSchema = z.object({
	team_id: z.string(),
	invited_by: z.string(),
	user_id: z.string().nullable().optional(),
	email: z.string().email("Email inválido"),
	role: z.enum(["owner", "admin", "member", "viewer"]),
	status: z.enum(["active", "inactive", "pending"]),
});

export type TeamMember = z.infer<typeof teamMemberSchema> & {
	id: string;
	teams?: Team;
	created_at: string;
	updated_at: string;
};
