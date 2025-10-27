interface Plan {
	id: string;
	name: string;
	description: string;
	priceInCents: number;
	features: string[];
	popular?: boolean;
}

interface PlatformConfigs {
	name: string;
	plans: Plan[];
}

export const platformConfigs: PlatformConfigs = {
	name: "OnDesk",
	plans: [
		{
			id: "starter",
			name: "Starter",
			description: "Perfect for small businesses getting started",
			priceInCents: 2900, // $29/month
			features: ["Up to 3 AI agents", "1,000 conversations/month", "WhatsApp integration", "Website widget", "Email support", "Basic analytics"],
		},
		{
			id: "professional",
			name: "Professional",
			description: "For growing businesses with higher volume",
			priceInCents: 9900, // $99/month
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
};
