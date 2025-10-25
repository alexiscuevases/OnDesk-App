import { z } from "zod";

export const teamMemberSchema = z.object({
	invited_by: z.string(),
	user_id: z.string(),
	email: z.string().min(1, "Name is required"),
	role: z.enum(["owner", "admin", "member", "viewer"]),
	status: z.enum(["active", "inactive", "pending"]),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};
