import { z } from "zod";

export const endpointSchema = z.object({
	agent_id: z.string().uuid("Agent ID must be a valid UUID"),
	name: z.string().min(1, "Name is required").max(100),
	description: z.string().min(10, "Description must be at least 10 characters"),
	method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
	url: z.string().url("Must be a valid URL"),
	headers_schema: z.record(z.string(), z.any()).optional().default({}),
	body_schema: z.record(z.any(), z.any()).optional().default({}),
	params_schema: z.record(z.any(), z.any()).optional().default({}),
	response_schema: z.record(z.any(), z.any()).optional().default({}),
	timeout: z.number().min(1000).max(30000).default(10000),
	retry_count: z.number().min(0).max(3).default(1),
	is_active: z.boolean().default(true),
});

export type Endpoint = z.infer<typeof endpointSchema> & {
	id: string;
	created_at: string;
	updated_at: string;
};

/**
 * Create
 */
export const createEndpointSchema = z.object({
	agent_id: endpointSchema.shape.agent_id,
	name: endpointSchema.shape.name,
	description: endpointSchema.shape.description,
	method: endpointSchema.shape.method,
	url: endpointSchema.shape.url,
	headers_schema: endpointSchema.shape.headers_schema,
	body_schema: endpointSchema.shape.body_schema,
	params_schema: endpointSchema.shape.params_schema,
	response_schema: endpointSchema.shape.response_schema,
	timeout: endpointSchema.shape.timeout.optional(),
	retry_count: endpointSchema.shape.retry_count.optional(),
	is_active: endpointSchema.shape.is_active.optional(),
});

export type CreateEndpointInput = z.infer<typeof createEndpointSchema>;

/**
 * Update
 */
export const updateEndpointSchema = createEndpointSchema.partial().omit({ agent_id: true });

export type UpdateEndpointInput = z.infer<typeof updateEndpointSchema>;
