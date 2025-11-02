import { z } from "zod";
import { Agent } from "./agent";
import {
	CONVERSATION_CHANNELS,
	CONVERSATION_DEFAULT_PRIORITY,
	CONVERSATION_DEFAULT_STATUS,
	CONVERSATION_PRIORITIES,
	CONVERSATION_STATUSES,
} from "../constants/conversation";

export const conversationSchema = z.object({
	team_id: z.string().min(1, "'Team ID' is required"),
	connection_id: z.string().min(1, "'Connection ID' is required"),
	agent_id: z.string().optional(),
	customer_name: z.string().optional(),
	customer_email: z.string().optional(),
	customer_phone: z.string().optional(),
	channel: z.enum(CONVERSATION_CHANNELS),
	status: z.enum(CONVERSATION_STATUSES).default(CONVERSATION_DEFAULT_STATUS),
	priority: z.enum(CONVERSATION_PRIORITIES).default(CONVERSATION_DEFAULT_PRIORITY),
});

export type Conversation = z.infer<typeof conversationSchema> & {
	id: string;
	agents?: Agent;
	closed_at: string;
	created_at: string;
	updated_at: string;
};
