import { z } from "zod";

export const teamSchema = z.object({
	owner_id: z.string().min(1, "'Owner ID' is required"),
	name: z.string().min(1, "Name is required"),
	description: z.string().max(500).optional(),
	stripe_subscription_id: z.string().optional(),
	stripe_subscription_status: z.enum(["active", "canceled", "past_due", "trialing", "incomplete"]).optional(),
	plan: z.enum(["starter", "professional", "enterprise"]).optional(),
});

export type Team = z.infer<typeof teamSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};

export const createTeamSchema = z.object({
	owner_id: teamSchema.shape.owner_id,
	name: teamSchema.shape.name,
	description: teamSchema.shape.description,
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;

export type UpdateTeamInput = Partial<Team>;
