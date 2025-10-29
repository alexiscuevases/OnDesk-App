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

/**
 * Configs
 */
export const baseConnectionSchema = z.object({
	team_id: connectionSchema.shape.team_id,
	name: connectionSchema.shape.name,
	type: connectionSchema.shape.type,
	status: connectionSchema.shape.status,
	config: connectionSchema.shape.config,
});

const whatsappSchema = baseConnectionSchema.extend({
	type: z.literal("whatsapp"),
	phoneNumber: z.string().min(1, "Número de teléfono requerido"),
	phoneNumberId: z.string().min(1, "Phone Number ID requerido"),
	apiKey: z.string().min(1, "Access Token requerido"),
	accountName: z.string().optional(),
});

const websiteSchema = baseConnectionSchema.extend({
	type: z.literal("website"),
	websiteUrl: z.string().url("Debe ser una URL válida"),
	widgetName: z.string().optional(),
	welcomeMessage: z.string().optional(),
});

/**
 * Create
 */
export const baseCreateConnectionSchema = baseConnectionSchema;

export type baseCreateConnectionInput = z.infer<typeof baseCreateConnectionSchema>;

export const createConnectionSchema = z.discriminatedUnion("type", [whatsappSchema, websiteSchema]);

export type CreateConnectionInput = z.infer<typeof createConnectionSchema>;

/**
 * Update
 */
export const baseUpdateConnectionSchema = baseConnectionSchema.partial();

export type baseUpdateConnectionInput = z.infer<typeof baseUpdateConnectionSchema>;

export const updateConnectionSchema = z.discriminatedUnion("type", [whatsappSchema.partial(), websiteSchema.partial()]);

export type UpdateConnectionInput = z.infer<typeof updateConnectionSchema>;
