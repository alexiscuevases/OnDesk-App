export const NOTIFICATION_TYPES_OBJECT = {
	info: "Info",
	success: "Success",
	warning: "Warning",
	error: "Error",
} as const;
export const NOTIFICATION_TYPES = Object.keys(NOTIFICATION_TYPES_OBJECT) as (keyof typeof NOTIFICATION_TYPES_OBJECT)[];
