import { z } from "zod";
import { MESSAGE_DEFAULT_STATUS, MESSAGE_ROLES, MESSAGE_STATUSES } from "../constants/message";

/**
 * Base
 */
export const messageSchema = z.object({
	conversation_id: z.string().min(1, "'Conversation ID' is required"),
	role: z.enum(MESSAGE_ROLES),
	content: z.string().min(1, "Content is required"),
	content_type: z.string().optional(),
	status: z.enum(MESSAGE_STATUSES).default(MESSAGE_DEFAULT_STATUS),
	metadata: z.record(z.any(), z.any()).default({}),
});

export type Message = z.infer<typeof messageSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};
