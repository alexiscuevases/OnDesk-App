import { z } from "zod";
import { MARKETPLACE_CATEGORIES } from "../constants/marketplace";
import { MarketplaceAuthor } from "./marketplace_author";

/**
 * Base
 */
export const marketplaceSchema = z.object({
	author_id: z.uuid("'Author ID' must be a valid UUID"),
	avatar_url: z.url().optional(),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	featured: z.boolean().optional(),
	category: z.enum(MARKETPLACE_CATEGORIES),
	tags: z.array(z.string()).optional(),
	rating: z.number().optional(),
	installs: z.number().optional(),
	version: z.string().optional(),
	capabilities: z.array(z.string()).optional(),
	requirements: z.array(z.string()).optional(),
	endpoints: z.array(z.uuid()).optional(),
	system_prompt: z.string().min(10, "System prompt must be at least 10 characters"),
});

export type Marketplace = z.infer<typeof marketplaceSchema> & {
	id: string;
	author?: MarketplaceAuthor;
	created_at: string;
	updated_at: string;
};
