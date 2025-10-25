import { z } from "zod";

export const createTeamSchema = z.object({
	name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre no puede exceder 100 caracteres"),
	description: z.string().max(500, "La descripción no puede exceder 500 caracteres").optional(),
});

export const teamSchema = z.object({
	owner_id: z.string(),
	name: z.string().min(1, "Name is required"),
	description: z.string().max(500).optional(),
	stripe_subscription_id: z.string().nullable().optional(),
	stripe_subscription_status: z.enum(["active", "canceled", "past_due", "trialing", "incomplete"]).nullable().optional(),
	plan: z.string().nullable().optional(),
});

export const inviteTeamMemberSchema = z.object({
	email: z.string().email("Email inválido"),
	role: z.enum(["admin", "member", "viewer"]),
	team_id: z.string(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type InviteTeamMemberInput = z.infer<typeof inviteTeamMemberSchema>;

export type TeamInput = z.infer<typeof teamSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};
