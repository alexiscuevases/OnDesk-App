import { supabaseAdmin } from "../supabase/admin";
import { Endpoint } from "../validations/endpoint";

export class Endpoints {
	/**
	 *
	 */
	async executor(endpointId: string, params: Record<string, any> = {}) {
		const { data: endpoint, error: endpointError } = await supabaseAdmin.from("endpoints").select("*").eq("id", endpointId).single<Endpoint>();
		if (endpointError) throw endpointError;

		const start = Date.now();

		try {
			// Construir la URL con parámetros (para GET, DELETE)
			let url = endpoint.url;
			url = url.replace(/\{(\w+)\}/g, (_, key) => {
				const value = params[key];
				delete params[key];
				return encodeURIComponent(value ?? "");
			});

			if (["GET", "DELETE"].includes(endpoint.method.toUpperCase())) {
				const query = new URLSearchParams(params).toString();
				if (query) url += (url.includes("?") ? "&" : "?") + query;
			}

			// Preparar body (para POST, PUT, PATCH)
			const body = ["POST", "PUT", "PATCH"].includes(endpoint.method.toUpperCase()) ? JSON.stringify(params) : undefined;
			const response = await fetch(url, {
				method: endpoint.method,
				headers: {
					"Content-Type": "application/json",
					...endpoint.headers_schema,
				},
				body,
			});
			if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

			const data = await response.json().catch(() => ({}));
			const duration = Date.now() - start;

			return {
				success: true,
				data,
				duration,
			};
		} catch (err: unknown) {
			const duration = Date.now() - start;
			if (err instanceof Error) return { success: false, error: err.message, duration };
			return { success: false, error: "Unexpected error occurred executing Endpoint fetch", duration };
		}
	}
}

export const endpoints = new Endpoints();
