import { z } from "zod";

export const agentSchema = z.object({
	team_id: z.string().min(1, "'Team ID' is required"),
	avatar_url: z.string().optional(),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	type: z.enum(["sales", "support", "general"]),
	model: z.enum(["gpt-4"]),
	system_prompt: z.string().min(10, "System prompt must be at least 10 characters"),
	temperature: z.number().min(0).max(2).default(0.7),
	max_tokens: z.number().min(100).max(4000).default(1000),
	status: z.enum(["active", "inactive", "training"]),
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
	model: agentSchema.shape.model,
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
