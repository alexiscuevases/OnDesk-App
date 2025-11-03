interface Plan {
	id: "starter" | "professional" | "enterprise";
	name: string;
	description: string;
	priceInCents: number;
	priceInCentsAnnual: number;
	features: string[];
	popular?: boolean;
}

interface PlatformConfigs {
	name: string;
	plans: Plan[];
	mails: any;
}

const ANNUAL_DISCOUNT_PERCENTAGE = 15;

export const platformConfigs: PlatformConfigs = {
	name: "OnDesk",
	plans: [
		{
			id: "starter",
			name: "Starter",
			description: "Perfect for small businesses getting started",
			priceInCents: 2900, // $29/month
			priceInCentsAnnual: 2900 * 12 - (2900 * 12 * ANNUAL_DISCOUNT_PERCENTAGE) / 100,
			features: ["Up to 3 AI agents", "1,000 conversations/month", "WhatsApp integration", "Website widget", "Email support", "Basic analytics"],
		},
		{
			id: "professional",
			name: "Professional",
			description: "For growing businesses with higher volume",
			priceInCents: 9900, // $99/month
			priceInCentsAnnual: 9900 * 12 - (9900 * 12 * ANNUAL_DISCOUNT_PERCENTAGE) / 100,
			features: [
				"Up to 10 AI agents",
				"10,000 conversations/month",
				"All integrations",
				"Advanced analytics",
				"Priority support",
				"Custom branding",
				"Team collaboration",
				"API access",
			],
			popular: true,
		},
		{
			id: "enterprise",
			name: "Enterprise",
			description: "For large organizations with custom needs",
			priceInCents: 29900, // $299/month
			priceInCentsAnnual: 29900 * 12 - (29900 * 12 * ANNUAL_DISCOUNT_PERCENTAGE) / 100,
			features: [
				"Unlimited AI agents",
				"Unlimited conversations",
				"All integrations",
				"Advanced analytics",
				"24/7 phone support",
				"Custom branding",
				"Unlimited team members",
				"API access",
				"Dedicated account manager",
				"Custom integrations",
				"SLA guarantee",
			],
		},
	],
	mails: {
		support: "support@ondesk.cc",
		sales: "sales@ondesk.cc",
		legal: "legal@ondesk.cc",
	},
};
