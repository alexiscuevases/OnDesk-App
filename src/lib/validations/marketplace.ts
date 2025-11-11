import { z } from "zod";
import { MARKETPLACE_CATEGORIES } from "../constants/marketplace";

/**
 * Base
 */
export const marketplaceSchema = z.object({
	author_id: z.uuid("'Author ID' must be a valid UUID"),
	avatar_url: z.url().optional(),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	category: z.enum(MARKETPLACE_CATEGORIES),
	tags: z.array(z.string()).optional(),
	rating: z.number().optional(),
	installs: z.number().optional(),
	version: z.string().optional(),
	capabilities: z.array(z.string()).optional(),
	requirements: z.array(z.string()).optional(),
	agent_endpoints: z.array(z.uuid()).optional(),
	agent_system_prompt: z.string().min(10, "System prompt must be at least 10 characters"),
});

export type Marketplace = z.infer<typeof marketplaceSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};

/**
 *  Install Marketplace
 */
export const installMarketplaceInputSchema = z.object({
	team_id: z.string().uuid("Team ID must be a valid UUID"),
	avatar_url: marketplaceSchema.shape.avatar_url,
	name: marketplaceSchema.shape.name,
	description: marketplaceSchema.shape.description,
	agent_system_prompt: marketplaceSchema.shape.agent_system_prompt,
	agent_endpoints: marketplaceSchema.shape.agent_endpoints,
});

export type InstallMarketplaceInput = z.infer<typeof installMarketplaceInputSchema>;
