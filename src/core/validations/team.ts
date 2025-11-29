import { z } from "zod";
import { TEAM_PLANS, TEAM_STRIPE_SUBSCRIPTION_STATUSES } from "../constants/team";

/**
 * Base
 */
export const teamSchema = z.object({
	owner_id: z.string().min(1, "'Owner ID' is required"),
	name: z.string().min(1, "Name is required"),
	description: z.string().max(500).optional(),
	stripe_subscription_id: z.string().optional(),
	stripe_subscription_status: z.enum(TEAM_STRIPE_SUBSCRIPTION_STATUSES).optional(),
	plan: z.enum(TEAM_PLANS).optional(),
});

export type Team = z.infer<typeof teamSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};

/**
 * Create
 */
export const createTeamSchema = z.object({
	owner_id: teamSchema.shape.owner_id,
	name: teamSchema.shape.name,
	description: teamSchema.shape.description,
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;

/**
 * Update
 */
export const updateTeamSchema = z
	.object({
		owner_id: teamSchema.shape.owner_id,
		name: teamSchema.shape.name,
		description: teamSchema.shape.description,
	})
	.partial();

export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
