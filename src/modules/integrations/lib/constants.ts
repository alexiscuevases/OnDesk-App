export const INTEGRATION_STATUSES_OBJECT = {
	connected: "Connected",
	disconnected: "Disconnected",
	error: "Error",
} as const;
export const INTEGRATION_STATUSES = Object.keys(INTEGRATION_STATUSES_OBJECT) as (keyof typeof INTEGRATION_STATUSES_OBJECT)[];

export const INTEGRATION_DEFAULT_STATUS = "disconnected" as const;
