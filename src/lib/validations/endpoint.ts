import { z } from "zod";
import { ENDPOINT_DEFAULT_RETRY_COUNT, ENDPOINT_DEFAULT_TIMEOUT, ENDPOINT_METHODS } from "../constants/endpoint";

const jsonOrRecord = z.union([
	z.string().transform((val, ctx) => {
		if (!val) return {};
		try {
			return JSON.parse(val);
		} catch {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Must be valid JSON",
			});
			return z.NEVER;
		}
	}),
	z.record(z.any(), z.any()),
]);

/**
 * Base
 */
export const endpointSchema = z.object({
	agent_id: z.string().uuid("Agent ID must be a valid UUID"),
	name: z.string().min(1, "Name is required").max(100),
	description: z.string().min(10, "Description must be at least 10 characters"),
	method: z.enum(ENDPOINT_METHODS),
	url: z.string().url("Must be a valid URL"),
	headers_schema: jsonOrRecord.optional().default({}),
	params_schema: jsonOrRecord.optional().default({}),
	response_schema: jsonOrRecord.optional().default({}),
	timeout: z.number().min(1000).max(30000).default(ENDPOINT_DEFAULT_TIMEOUT),
	retry_count: z.number().min(0).max(3).default(ENDPOINT_DEFAULT_RETRY_COUNT),
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
