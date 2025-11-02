import { CONNECTION_TYPES_OBJECT } from "./connection";

export const CONVERSATION_CHANNELS_OBJECT = CONNECTION_TYPES_OBJECT;
export const CONVERSATION_CHANNELS = Object.keys(CONVERSATION_CHANNELS_OBJECT) as (keyof typeof CONVERSATION_CHANNELS_OBJECT)[];

export const CONVERSATION_STATUSES_OBJECT = {
	open: "Open",
	closed: "Closed",
	pending: "Pending",
} as const;
export const CONVERSATION_STATUSES = Object.keys(CONVERSATION_STATUSES_OBJECT) as (keyof typeof CONVERSATION_STATUSES_OBJECT)[];

export const CONVERSATION_PRIORITIES_OBJECT = {
	low: "Low",
	medium: "Medium",
	high: "High",
} as const;
export const CONVERSATION_PRIORITIES = Object.keys(CONVERSATION_PRIORITIES_OBJECT) as (keyof typeof CONVERSATION_PRIORITIES_OBJECT)[];

export const CONVERSATION_DEFAULT_STATUS = "pending" as const;
export const CONVERSATION_DEFAULT_PRIORITY = "medium" as const;
