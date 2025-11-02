export const AGENT_TYPES_OBJECT = {
	sales: "Sales",
	support: "Support",
	general: "General",
} as const;
export const AGENT_TYPES = Object.keys(AGENT_TYPES_OBJECT) as (keyof typeof AGENT_TYPES_OBJECT)[];

export const AGENT_MODELS_OBJECT = {
	"deepseek-chat": "DeepSeek - Chat",
} as const;
export const AGENT_MODELS = Object.keys(AGENT_MODELS_OBJECT) as (keyof typeof AGENT_MODELS_OBJECT)[];

export const AGENT_STATUSES_OBJECT = {
	active: "Active",
	inactive: "Inactive",
	training: "Training",
} as const;
export const AGENT_STATUSES = Object.keys(AGENT_STATUSES_OBJECT) as (keyof typeof AGENT_STATUSES_OBJECT)[];

export const AGENT_DEFAULT_TEMPERATURE = 0.7 as const;
export const AGENT_DEFAULT_MAX_TOKENS = 1000 as const;
export const AGENT_DEFAULT_SATISFACTION = 0 as const;
