import { z } from "zod";

export const connectionSchema = z.object({
	team_id: z.string().min(1, "'Team ID' is required"),
	name: z.string().min(1, "Name is required"),
	type: z.enum(["whatsapp", "website", "email"]),
	status: z.enum(["connected", "disconnected", "error"]).default("disconnected"),
	config: z.record(z.any(), z.any()),
});

export type Connection = z.infer<typeof connectionSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};
