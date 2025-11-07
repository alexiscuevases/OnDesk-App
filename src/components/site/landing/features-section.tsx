import { Card, CardContent } from "@/components/ui/card";
import { Bot, MessageSquare, Zap, Globe, Users, BarChart3 } from "lucide-react";

const features = [
	{
		icon: Bot,
		title: "Custom AI Agents",
		description: "Create specialized agents with custom prompts tailored to your business needs and brand voice.",
	},
	{
		icon: MessageSquare,
		title: "WhatsApp Integration",
		description: "Connect your agents directly to WhatsApp and engage customers on their preferred platform.",
	},
	{
		icon: Globe,
		title: "Website Chat Widget",
		description: "Embed a floating chat widget on your website for instant customer support and engagement.",
	},
	{
		icon: Zap,
		title: "Instant Responses",
		description: "Provide 24/7 automated responses with human-like conversations powered by advanced AI.",
	},
	{
		icon: Users,
		title: "Team Collaboration",
		description: "Manage multiple agents with your team, assign roles, and collaborate seamlessly.",
	},
	{
		icon: BarChart3,
		title: "Analytics & Insights",
		description: "Track conversations, measure performance, and optimize your agents with detailed analytics.",
	},
];

export function FeaturesSection() {
	return (
		<section id="features" className="py-20 md:py-32">
			<div className="container">
				<div className="mx-auto max-w-2xl text-center mb-16">
					<h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl mb-4">
						Everything you need to automate customer engagement
					</h2>
					<p className="text-lg text-muted-foreground text-pretty leading-relaxed">
						Powerful features designed to help you create, deploy, and manage AI agents that deliver exceptional customer experiences.
					</p>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{features.map((feature, index) => (
						<Card key={index} className="border-border/50 bg-card hover:border-primary/50 transition-colors">
							<CardContent className="p-6">
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
									<feature.icon className="h-6 w-6 text-primary" />
								</div>
								<h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
								<p className="text-muted-foreground leading-relaxed">{feature.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
