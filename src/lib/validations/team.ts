import { z } from "zod";

export const teamSchema = z.object({
	owner_id: z.string(),
	name: z.string().min(1, "Name is required"),
	description: z.string().max(500).optional(),
	stripe_subscription_id: z.string(),
	stripe_subscription_status: z.enum(["active", "canceled", "past_due", "trialing", "incomplete"]),
	plan: z.string(),
});

export type TeamInput = z.infer<typeof teamSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};
