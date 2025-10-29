import { z } from "zod";

export const notificationSchema = z.object({
	user_id: z.string().min(1, "'User ID' is required"),
	title: z.string().min(1, "Title is required"),
	content: z.string().min(1, "Content is required"),
	type: z.enum(["info", "success", "warning", "error"]),
	read: z.boolean().default(false),
});

export type Notification = z.infer<typeof notificationSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};
