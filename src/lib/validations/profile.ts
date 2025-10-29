import { z } from "zod";

export const profileSchema = z.object({
	stripe_customer_id: z.string().optional(),
	team_id: z.string().optional(),
	avatar_url: z.string().optional(),
	full_name: z.string().min(1, "'Full Name' is required"),
	company_name: z.string().optional(),
});

export type Profile = z.infer<typeof profileSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};
