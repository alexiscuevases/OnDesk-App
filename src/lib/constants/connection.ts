export const CONNECTION_TYPES_OBJECT = {
	whatsapp: "Whatsapp",
	website: "Website",
} as const;
export const CONNECTION_TYPES = Object.keys(CONNECTION_TYPES_OBJECT) as (keyof typeof CONNECTION_TYPES_OBJECT)[];

export const CONNECTION_STATUSES_OBJECT = {
	connected: "Connected",
	disconnected: "Disconnected",
	error: "Error",
} as const;
export const CONNECTION_STATUSES = Object.keys(CONNECTION_STATUSES_OBJECT) as (keyof typeof CONNECTION_STATUSES_OBJECT)[];

export const CONNECTION_DEFAULT_STATUS = "disconnected" as const;
