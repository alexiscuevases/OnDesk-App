export const MESSAGE_ROLES_OBJECT = {
	user: "User",
	agent: "Agent",
	system: "System",
} as const;

export const MESSAGE_ROLES = Object.keys(MESSAGE_ROLES_OBJECT) as (keyof typeof MESSAGE_ROLES_OBJECT)[];
