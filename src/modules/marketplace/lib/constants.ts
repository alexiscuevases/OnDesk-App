export const MARKETPLACE_CATEGORIES_OBJECT = {
	productivity: "Productivity",
	other: "Other",
} as const;
export const MARKETPLACE_CATEGORIES = Object.keys(MARKETPLACE_CATEGORIES_OBJECT) as (keyof typeof MARKETPLACE_CATEGORIES_OBJECT)[];
