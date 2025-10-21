import { z } from "zod"

export const agentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  type: z.enum(["sales", "support", "general"]),
  model: z.string().min(1, "Model is required"),
  systemPrompt: z.string().min(10, "System prompt must be at least 10 characters"),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(100).max(4000).default(1000),
  status: z.enum(["active", "inactive"]).default("active"),
})

export type AgentInput = z.infer<typeof agentSchema>
