import { z } from "zod";
import { Team } from "./team";

/**
 * Base
 */
export const profileSchema = z.object({
	stripe_customer_id: z.string().optional(),
	team_id: z.string().optional(),
	avatar_url: z.string().optional(),
	email: z.string().email("Invalid email address"),
	full_name: z.string().min(2, "'Full name' must be at least 2 characters"),
	company_name: z.string().optional(),
});

export type Profile = z.infer<typeof profileSchema> & {
	id: string;
	teams?: Team;
	created_at: string;
	updated_at: string;
};
