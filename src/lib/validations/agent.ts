import { z } from "zod";

export const agentSchema = z.object({
	team_id: z.string().min(1, "'Team ID' is required"),
	avatar_url: z.string().optional(),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	type: z.enum(["sales", "support", "general"]),
	model: z.enum(["gpt-4"]),
	systemPrompt: z.string().min(10, "System prompt must be at least 10 characters"),
	temperature: z.number().min(0).max(2).default(0.7),
	maxTokens: z.number().min(100).max(4000).default(1000),
	status: z.enum(["active", "inactive", "training"]),
});

export type Agent = z.infer<typeof agentSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};
