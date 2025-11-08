"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Bot, Calendar, Mail, ShoppingCart, Users, MessageSquare, Star, TrendingUp, Clock, Zap, Building2 } from "lucide-react";
import { MarketplaceAgentDetailsDialog } from "../dialogs/marketplace-agent-details-dialog";
import type { MarketplaceFilters } from "@/app/dashboard/marketplace/page";

export interface MarketplaceAgent {
	id: string;
	name: string;
	description: string;
	longDescription: string;
	category: string;
	icon: any;
	rating: number;
	installs: string;
	featured?: boolean;
	tags: string[];
	version: string;
	author: string;
	lastUpdated: string;
	capabilities: string[];
	requirements: string[];
}

const marketplaceAgents: MarketplaceAgent[] = [
	{
		id: "calendly-agent",
		name: "Calendly Agent",
		description: "Automatically schedule meetings and manage your calendar. Integrates seamlessly with Calendly to book appointments.",
		longDescription:
			"The Calendly Agent is a powerful automation tool that connects directly to your Calendly account. It can check availability, schedule meetings, send confirmation emails, and handle rescheduling requests automatically. Perfect for businesses that want to streamline their appointment booking process.",
		category: "Productivity",
		icon: Calendar,
		rating: 4.8,
		installs: "2.5k",
		featured: true,
		tags: ["Scheduling", "Meetings", "Calendar"],
		version: "2.1.0",
		author: "Calendly Team",
		lastUpdated: "2 weeks ago",
		capabilities: ["Check availability", "Book appointments", "Send confirmations", "Handle rescheduling", "Sync with calendar"],
		requirements: ["Calendly API key", "Active Calendly account"],
	},
	{
		id: "email-assistant",
		name: "Email Assistant",
		description: "AI-powered email responses and inbox management. Drafts professional replies and organizes your emails efficiently.",
		longDescription:
			"Transform your email workflow with this intelligent assistant. It uses advanced AI to understand context, draft professional responses, categorize emails, and prioritize your inbox. Supports Gmail, Outlook, and other major email providers.",
		category: "Productivity",
		icon: Mail,
		rating: 4.9,
		installs: "5.2k",
		featured: true,
		tags: ["Email", "Automation", "Communication"],
		version: "3.0.1",
		author: "Email AI Inc",
		lastUpdated: "1 week ago",
		capabilities: ["Draft responses", "Categorize emails", "Priority sorting", "Smart replies", "Template management"],
		requirements: ["Email provider credentials", "IMAP/SMTP access"],
	},
	{
		id: "ecommerce-support",
		name: "E-commerce Support",
		description: "Handle customer inquiries, process orders, and provide product recommendations for your online store.",
		longDescription:
			"Dedicated customer support agent for e-commerce businesses. Integrates with popular platforms like Shopify, WooCommerce, and Magento. Answers product questions, tracks orders, handles returns, and provides personalized recommendations.",
		category: "Sales",
		icon: ShoppingCart,
		rating: 4.7,
		installs: "3.8k",
		featured: true,
		tags: ["E-commerce", "Support", "Sales"],
		version: "1.9.5",
		author: "Commerce AI",
		lastUpdated: "3 days ago",
		capabilities: ["Order tracking", "Product recommendations", "Return processing", "FAQ responses", "Inventory checks"],
		requirements: ["E-commerce platform integration", "Product catalog access"],
	},
	{
		id: "hr-assistant",
		name: "HR Assistant",
		description: "Streamline HR operations with automated onboarding, benefits inquiries, and employee support.",
		longDescription:
			"Comprehensive HR automation tool that handles employee onboarding, benefits questions, time-off requests, and general HR inquiries. Reduces HR workload while providing 24/7 support to employees.",
		category: "Business",
		icon: Users,
		rating: 4.6,
		installs: "1.9k",
		tags: ["HR", "Onboarding", "Employee Support"],
		version: "2.3.0",
		author: "HR Tech Solutions",
		lastUpdated: "1 month ago",
		capabilities: ["Onboarding automation", "Benefits Q&A", "Time-off requests", "Policy information", "Document management"],
		requirements: ["HR system integration", "Employee database access"],
	},
	{
		id: "lead-qualifier",
		name: "Lead Qualifier",
		description: "Qualify leads automatically by asking the right questions and routing them to your sales team.",
		longDescription:
			"Intelligent lead qualification system that engages with prospects, asks qualifying questions, scores leads, and routes high-quality leads to your sales team. Integrates with major CRM platforms.",
		category: "Sales",
		icon: TrendingUp,
		rating: 4.8,
		installs: "4.1k",
		tags: ["Sales", "Leads", "Qualification"],
		version: "2.5.2",
		author: "SalesForce Pro",
		lastUpdated: "5 days ago",
		capabilities: ["Lead scoring", "Question flows", "CRM integration", "Automated routing", "Analytics reporting"],
		requirements: ["CRM integration", "Sales team configuration"],
	},
	{
		id: "customer-feedback",
		name: "Feedback Collector",
		description: "Collect and analyze customer feedback through conversational surveys and sentiment analysis.",
		longDescription:
			"Gather valuable customer insights through natural conversations. This agent conducts surveys, analyzes sentiment, identifies trends, and generates actionable reports to help improve your products and services.",
		category: "Support",
		icon: MessageSquare,
		rating: 4.5,
		installs: "2.2k",
		tags: ["Feedback", "Surveys", "Analytics"],
		version: "1.8.0",
		author: "Feedback Analytics",
		lastUpdated: "2 weeks ago",
		capabilities: ["Survey creation", "Sentiment analysis", "Trend identification", "Report generation", "Follow-up automation"],
		requirements: ["Analytics platform", "Survey templates"],
	},
	{
		id: "appointment-reminder",
		name: "Appointment Reminder",
		description: "Send automated appointment reminders and handle rescheduling requests with ease.",
		longDescription:
			"Reduce no-shows with automated reminder system. Sends timely reminders via SMS, email, or push notifications. Handles rescheduling requests and confirmations automatically.",
		category: "Productivity",
		icon: Clock,
		rating: 4.7,
		installs: "3.3k",
		tags: ["Reminders", "Appointments", "Scheduling"],
		version: "2.0.3",
		author: "Schedule Master",
		lastUpdated: "1 week ago",
		capabilities: ["Automated reminders", "Multi-channel notifications", "Rescheduling handling", "Confirmation tracking", "Calendar sync"],
		requirements: ["Calendar system", "SMS/Email service"],
	},
	{
		id: "sales-accelerator",
		name: "Sales Accelerator",
		description: "Boost your sales with AI-driven insights, follow-ups, and personalized customer interactions.",
		longDescription:
			"Advanced sales automation powered by AI. Analyzes customer behavior, provides personalized recommendations, automates follow-ups, and helps close deals faster. Integrates seamlessly with your sales pipeline.",
		category: "Sales",
		icon: Zap,
		rating: 4.9,
		installs: "6.1k",
		featured: true,
		tags: ["Sales", "AI", "Automation"],
		version: "3.2.1",
		author: "Sales AI Corp",
		lastUpdated: "3 days ago",
		capabilities: ["Behavior analysis", "Personalized outreach", "Automated follow-ups", "Deal tracking", "Performance analytics"],
		requirements: ["CRM integration", "Sales data access"],
	},
	{
		id: "office-manager",
		name: "Office Manager",
		description: "Manage office resources, book meeting rooms, and handle facility requests automatically.",
		longDescription:
			"Complete office management solution that handles room bookings, equipment reservations, facility requests, and office announcements. Perfect for managing hybrid workspaces and office operations.",
		category: "Business",
		icon: Building2,
		rating: 4.4,
		installs: "1.5k",
		tags: ["Office", "Resources", "Management"],
		version: "1.5.8",
		author: "Office Solutions",
		lastUpdated: "3 weeks ago",
		capabilities: ["Room booking", "Equipment reservation", "Facility requests", "Visitor management", "Announcement system"],
		requirements: ["Office management system", "Resource calendar"],
	},
];

interface MarketplaceListProps {
	filters: MarketplaceFilters;
}

export function MarketplaceList({ filters }: MarketplaceListProps) {
	const [selectedAgent, setSelectedAgent] = useState<MarketplaceAgent | null>(null);

	const filteredAgents = marketplaceAgents.filter((agent) => {
		const matchesSearch =
			agent.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
			agent.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
			agent.tags.some((tag) => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()));

		const matchesCategory = filters.category === "all" || agent.category === filters.category;

		return matchesSearch && matchesCategory;
	});

	const featuredAgents = filteredAgents.filter((agent) => agent.featured);

	return (
		<>
			<div className="space-y-6">
				{/* Featured Section */}
				{featuredAgents.length > 0 && filters.category === "all" && !filters.searchQuery && (
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
							<h2 className="text-xl font-semibold">Featured Agents</h2>
						</div>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{featuredAgents.map((agent) => (
								<AgentCard key={agent.id} agent={agent} featured onSelect={setSelectedAgent} />
							))}
						</div>
					</div>
				)}

				{/* All Agents Grid */}
				<div className="space-y-4">
					{featuredAgents.length > 0 && filters.category === "all" && !filters.searchQuery && <h2 className="text-xl font-semibold">All Agents</h2>}
					{filteredAgents.length > 0 ? (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{filteredAgents.map((agent) => (
								<AgentCard key={agent.id} agent={agent} onSelect={setSelectedAgent} />
							))}
						</div>
					) : (
						<Card className="p-12">
							<div className="flex flex-col items-center justify-center text-center space-y-3">
								<Bot className="h-12 w-12 text-muted-foreground" />
								<h3 className="text-lg font-semibold">No agents found</h3>
								<p className="text-sm text-muted-foreground max-w-sm">
									Try adjusting your search or category filters to find what you're looking for.
								</p>
							</div>
						</Card>
					)}
				</div>
			</div>

			{selectedAgent && (
				<MarketplaceAgentDetailsDialog open={!!selectedAgent} onOpenChange={(open) => !open && setSelectedAgent(null)} agent={selectedAgent} />
			)}
		</>
	);
}

interface AgentCardProps {
	agent: MarketplaceAgent;
	featured?: boolean;
	onSelect: (agent: MarketplaceAgent) => void;
}

function AgentCard({ agent, featured = false, onSelect }: AgentCardProps) {
	return (
		<Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
			{featured && (
				<div className="absolute top-0 right-0">
					<Badge className="rounded-bl-lg rounded-tr-lg rounded-tl-none rounded-br-none bg-yellow-500 hover:bg-yellow-500">
						<Star className="h-3 w-3 mr-1 fill-current" />
						Featured
					</Badge>
				</div>
			)}

			<CardHeader>
				<div className="flex items-start gap-3">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<agent.icon className="h-6 w-6 text-primary" />
					</div>
					<div className="flex-1 min-w-0">
						<CardTitle className="text-lg line-clamp-1">{agent.name}</CardTitle>
						<div className="flex items-center gap-3 mt-1">
							<div className="flex items-center gap-1">
								<Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
								<span className="text-xs text-muted-foreground">{agent.rating}</span>
							</div>
							<span className="text-xs text-muted-foreground">{agent.installs} installs</span>
						</div>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				<CardDescription className="line-clamp-2 leading-relaxed">{agent.description}</CardDescription>

				<div className="flex flex-wrap gap-1.5">
					{agent.tags.map((tag) => (
						<Badge key={tag} variant="outline" className="text-xs">
							{tag}
						</Badge>
					))}
				</div>

				<div className="flex gap-2 pt-2">
					<Button size="sm" className="flex-1" onClick={() => onSelect(agent)}>
						Install
					</Button>
					<Button size="sm" variant="outline" onClick={() => onSelect(agent)}>
						Details
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
