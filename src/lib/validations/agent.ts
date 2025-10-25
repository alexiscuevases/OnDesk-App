import { z } from "zod";

export const agentSchema = z.object({
	team_id: z.string().min(1, "Team ID is required"),
	name: z.string().min(1, "Name is required"),
	description: z.string().max(500).optional(),
	avatar_url: z.string().optional(),
	type: z.enum(["sales", "support", "technical", "onboarding", "custom"]),
	model: z.enum(["gpt-4"]),
	systemPrompt: z.string().min(10, "System prompt must be at least 10 characters"),
	temperature: z.number().min(0).max(2),
	maxTokens: z.number().min(100).max(4000),
	status: z.enum(["active", "inactive", "training"]),
});

export type AgentInput = z.infer<typeof agentSchema>;
