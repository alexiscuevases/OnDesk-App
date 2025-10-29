import { z } from "zod";

export const connectionSchema = z.object({
	team_id: z.string().min(1, "'Team ID' is required"),
	name: z.string().min(1, "Name is required"),
	type: z.enum(["whatsapp", "website"]),
	status: z.enum(["connected", "disconnected", "error"]).default("disconnected"),
	config: z.record(z.any(), z.any()),
});

export type Connection = z.infer<typeof connectionSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};

export const createConnectionSchema = z.object({
	team_id: connectionSchema.shape.team_id,
	name: connectionSchema.shape.name,
	type: connectionSchema.shape.type,
	status: connectionSchema.shape.status,
	config: connectionSchema.shape.config,
});

export type CreateConnectionInput = z.infer<typeof createConnectionSchema>;

export type UpdateConnectionInput = Partial<Connection>;
