import { z } from "zod";

export const conversationSchema = z.object({
	team_id: z.string().min(1, "'Team ID' is required"),
	customer_name: z.string().optional(),
	customer_email: z.string().optional(),
	customer_phone: z.string().optional(),
	channel: z.enum(["whatsapp", "website"]),
	status: z.enum(["open", "resolved", "pending"]).default("pending"),
	priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export type Conversation = z.infer<typeof conversationSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};
