import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const roadmapItems = [
	{
		quarter: "Q1 2025",
		status: "completed",
		features: [
			{
				title: "WhatsApp Business Integration",
				description: "Connect your AI agents directly to WhatsApp Business API",
				status: "completed",
			},
			{
				title: "Website Widget",
				description: "Embeddable chat widget for your website",
				status: "completed",
			},
			{
				title: "Advanced Analytics Dashboard",
				description: "Comprehensive insights into agent performance and customer interactions",
				status: "completed",
			},
		],
	},
	{
		quarter: "Q2 2025",
		status: "in-progress",
		features: [
			{
				title: "Voice AI Integration",
				description: "Enable voice conversations with your AI agents",
				status: "in-progress",
			},
			{
				title: "Multi-language Support",
				description: "Support for 50+ languages with automatic translation",
				status: "in-progress",
			},
			{
				title: "Custom Integrations API",
				description: "Build custom integrations with our powerful API",
				status: "planned",
			},
		],
	},
	{
		quarter: "Q3 2025",
		status: "planned",
		features: [
			{
				title: "Instagram & Facebook Messenger",
				description: "Expand to social media platforms",
				status: "planned",
			},
			{
				title: "Advanced Workflow Automation",
				description: "Create complex automation workflows with visual builder",
				status: "planned",
			},
			{
				title: "Sentiment Analysis",
				description: "Real-time sentiment tracking and alerts",
				status: "planned",
			},
		],
	},
	{
		quarter: "Q4 2025",
		status: "planned",
		features: [
			{
				title: "AI Agent Marketplace",
				description: "Browse and deploy pre-trained agents for specific industries",
				status: "planned",
			},
			{
				title: "Video Chat Support",
				description: "Enable video conversations with screen sharing",
				status: "planned",
			},
			{
				title: "Enterprise SSO",
				description: "Single sign-on for enterprise customers",
				status: "planned",
			},
		],
	},
];

const statusConfig = {
	completed: {
		icon: CheckCircle2,
		color: "text-green-500",
		bgColor: "bg-green-500/10",
		label: "Completed",
	},
	"in-progress": {
		icon: Clock,
		color: "text-blue-500",
		bgColor: "bg-blue-500/10",
		label: "In Progress",
	},
	planned: {
		icon: Circle,
		color: "text-muted-foreground",
		bgColor: "bg-muted",
		label: "Planned",
	},
};

export default function RoadmapPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader />
			<main className="flex-1">
				{/* Hero Section */}
				<section className="container py-16 md:py-24">
					<div className="mx-auto max-w-3xl text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
							Product <span className="text-primary">Roadmap</span>
						</h1>
						<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
							See what we're building next. Our roadmap is driven by customer feedback and our vision for the future of AI-powered customer
							engagement.
						</p>
					</div>
				</section>

				{/* Roadmap Timeline */}
				<section className="container pb-16 md:pb-24">
					<div className="mx-auto max-w-4xl">
						<div className="space-y-8">
							{roadmapItems.map((item, index) => {
								const StatusIcon = statusConfig[item.status as keyof typeof statusConfig].icon;
								const statusColor = statusConfig[item.status as keyof typeof statusConfig].color;
								const statusBgColor = statusConfig[item.status as keyof typeof statusConfig].bgColor;
								const statusLabel = statusConfig[item.status as keyof typeof statusConfig].label;

								return (
									<div key={index} className="relative">
										{/* Timeline Line */}
										{index !== roadmapItems.length - 1 && <div className="absolute left-6 top-16 bottom-0 w-px bg-border" />}

										<div className="flex gap-6">
											{/* Quarter Badge */}
											<div className="flex flex-col items-center">
												<div className={`flex h-12 w-12 items-center justify-center rounded-full ${statusBgColor} relative z-10`}>
													<StatusIcon className={`h-6 w-6 ${statusColor}`} />
												</div>
											</div>

											{/* Content */}
											<div className="flex-1 pb-8">
												<div className="flex items-center gap-3 mb-4">
													<h2 className="text-2xl font-bold">{item.quarter}</h2>
													<Badge variant={item.status === "completed" ? "default" : "secondary"}>{statusLabel}</Badge>
												</div>

												<div className="space-y-4">
													{item.features.map((feature, featureIndex) => {
														const FeatureIcon = statusConfig[feature.status as keyof typeof statusConfig].icon;
														const featureColor = statusConfig[feature.status as keyof typeof statusConfig].color;

														return (
															<Card key={featureIndex} className="p-4">
																<div className="flex items-start gap-3">
																	<FeatureIcon className={`h-5 w-5 mt-0.5 ${featureColor}`} />
																	<div className="flex-1">
																		<h3 className="font-semibold mb-1">{feature.title}</h3>
																		<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
																	</div>
																</div>
															</Card>
														);
													})}
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</section>
			</main>
			<SiteFooter />
		</div>
	);
}
