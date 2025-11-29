import { z } from "zod";
import {
	AGENT_DEFAULT_MAX_TOKENS,
	AGENT_DEFAULT_MODEL,
	AGENT_DEFAULT_SATISFACTION,
	AGENT_DEFAULT_TEMPERATURE,
	AGENT_MODELS,
	AGENT_STATUSES,
	AGENT_TYPES,
} from "../constants/agent";

/**
 * Base
 */
export const agentSchema = z.object({
	team_id: z.string().min(1, "'Team ID' is required"),
	avatar_url: z.string().optional(),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	type: z.enum(AGENT_TYPES),
	model: z.enum(AGENT_MODELS).default(AGENT_DEFAULT_MODEL),
	system_prompt: z.string().min(10, "System prompt must be at least 10 characters"),
	temperature: z.number().min(0).max(2).default(AGENT_DEFAULT_TEMPERATURE),
	max_tokens: z.number().min(100).max(4000).default(AGENT_DEFAULT_MAX_TOKENS),
	status: z.enum(AGENT_STATUSES),
	satisfaction: z.number().default(AGENT_DEFAULT_SATISFACTION),
});

export type Agent = z.infer<typeof agentSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};

/**
 * Create
 */
export const createAgentSchema = z.object({
	team_id: agentSchema.shape.team_id,
	avatar_url: agentSchema.shape.avatar_url,
	name: agentSchema.shape.name,
	description: agentSchema.shape.description,
	type: agentSchema.shape.type,
	model: agentSchema.shape.model.optional(),
	system_prompt: agentSchema.shape.system_prompt,
	temperature: agentSchema.shape.temperature.optional(),
	max_tokens: agentSchema.shape.max_tokens.optional(),
	status: agentSchema.shape.status,
});

export type CreateAgentInput = z.infer<typeof createAgentSchema>;

/**
 * Update
 */
export const updateAgentSchema = z
	.object({
		team_id: agentSchema.shape.team_id,
		avatar_url: agentSchema.shape.avatar_url,
		name: agentSchema.shape.name,
		description: agentSchema.shape.description,
		type: agentSchema.shape.type,
		model: agentSchema.shape.model,
		system_prompt: agentSchema.shape.system_prompt,
		temperature: agentSchema.shape.temperature,
		max_tokens: agentSchema.shape.max_tokens,
		status: agentSchema.shape.status,
	})
	.partial();

export type UpdateAgentInput = z.infer<typeof updateAgentSchema>;
