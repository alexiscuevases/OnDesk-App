import { z } from "zod";
import { CONNECTION_DEFAULT_STATUS, CONNECTION_STATUSES } from "../constants/connection";
import { Marketplace } from "./marketplace";

/**
 * Base
 */
export const integrationSchema = z.object({
	team_id: z.string().min(1, "'Team ID' is required"),
	marketplace_id: z.uuid("Marketplace ID must be a valid UUID"),
	status: z.enum(CONNECTION_STATUSES).default(CONNECTION_DEFAULT_STATUS),
	config: z.record(z.any(), z.any()),
});

export type Integration = z.infer<typeof integrationSchema> & {
	id: string;
	marketplace?: Marketplace;
	created_at: string;
	updated_at: string;
};

/**
 *  Create Integration
 */
export const createIntegrationSchema = z.object({
	team_id: integrationSchema.shape.team_id,
	marketplace_id: integrationSchema.shape.marketplace_id,
	status: integrationSchema.shape.status,
	config: integrationSchema.shape.config,
});

export type CreateIntegrationInput = z.infer<typeof createIntegrationSchema>;

/**
 *  Update Integration
 */
export const updateIntegrationSchema = z
	.object({
		status: integrationSchema.shape.status,
		config: integrationSchema.shape.config,
	})
	.partial();

export type UpdateIntegrationInput = z.infer<typeof updateIntegrationSchema>;
