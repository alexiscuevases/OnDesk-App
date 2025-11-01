import { z } from "zod";
import { NOTIFICATION_TYPES } from "../constants/notification";

export const notificationSchema = z.object({
	user_id: z.string().min(1, "'User ID' is required"),
	title: z.string().min(1, "Title is required"),
	content: z.string().min(1, "Content is required"),
	type: z.enum(NOTIFICATION_TYPES),
	read: z.boolean().default(false),
	path: z.string().optional(),
});

export type Notification = z.infer<typeof notificationSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};
