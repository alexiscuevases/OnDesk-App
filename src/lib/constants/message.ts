export const MESSAGE_ROLES_OBJECT = {
	user: "User",
	agent: "Agent",
	system: "System",
} as const;
export const MESSAGE_ROLES = Object.keys(MESSAGE_ROLES_OBJECT) as (keyof typeof MESSAGE_ROLES_OBJECT)[];

export const MESSAGE_STATUSES_OBJECT = {
	sent: "Sent",
	delivered: "Delivered",
	seen: "Seen",
	failed: "Failed",
} as const;
export const MESSAGE_STATUSES = Object.keys(MESSAGE_STATUSES_OBJECT) as (keyof typeof MESSAGE_STATUSES_OBJECT)[];

export const MESSAGE_DEFAULT_STATUS = "sent" as const;
