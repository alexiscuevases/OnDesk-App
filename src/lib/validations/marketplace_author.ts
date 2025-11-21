import { z } from "zod";

/**
 * Base
 */
export const marketplaceAuthorSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	is_verified: z.boolean(),
});

export type MarketplaceAuthor = z.infer<typeof marketplaceAuthorSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};
