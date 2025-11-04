import { z } from "zod";

/**
 * Start Conversation
 */
export const startConversationSchema = z.object({
	customer_name: z.string().min(1, "Name is required"),
	customer_email: z.string().email("Invalid email address"),
});

export type StartConversationInput = z.infer<typeof startConversationSchema>;
