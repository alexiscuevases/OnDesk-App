export const TEAM_STRIPE_SUBSCRIPTION_STATUSES_OBJECT = {
	active: "Active",
	canceled: "Canceled",
	past_due: "Past due",
	trialing: "Trialing",
	incomplete: "Incomplete",
} as const;

export const TEAM_STRIPE_SUBSCRIPTION_STATUSES = Object.keys(
	TEAM_STRIPE_SUBSCRIPTION_STATUSES_OBJECT
) as (keyof typeof TEAM_STRIPE_SUBSCRIPTION_STATUSES_OBJECT)[];

export const TEAM_PLANS_OBJECT = {
	starter: "Starter",
	professional: "Professional",
	enterprise: "Enterprise",
} as const;

export const TEAM_PLANS = Object.keys(TEAM_PLANS_OBJECT) as (keyof typeof TEAM_PLANS_OBJECT)[];
