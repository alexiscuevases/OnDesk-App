import { z } from "zod";

export const messageSchema = z.object({
	conversation_id: z.string().min(1, "'Conversation ID' is required"),
	role: z.enum(["user", "agent", "system"]),
	content: z.string().min(1, "Content is required"),
});

export type Message = z.infer<typeof messageSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};
