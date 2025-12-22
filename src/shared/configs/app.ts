const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

export const AppConfigs = {
	url: NEXT_PUBLIC_SITE_URL,
	stripe: {
		publishableKey: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
	},
};
