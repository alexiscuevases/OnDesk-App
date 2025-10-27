import { z } from "zod";

export const connectionSchema = z.object({
	team_id: z.string(),
	name: z.string().min(1, "Name is required"),
	type: z.enum(["whatsapp", "website", "sms", "email"]),
	status: z.enum(["connected", "disconnected"]).default("disconnected"),
	config: z.record(z.any()),
});

export type ConnectionInput = z.infer<typeof connectionSchema>;
