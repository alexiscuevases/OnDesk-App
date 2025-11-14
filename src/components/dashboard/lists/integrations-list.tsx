"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Plug, Star } from "lucide-react";
import { MarketplaceAgentDetailsDialog } from "../dialogs/marketplace-agent-details-dialog";
import { Marketplace } from "@/lib/validations/marketplace";
import { useMarketplace } from "@/hooks/use-marketplace";
import { IntegrationsFilters } from "@/app/dashboard/integrations/page";

interface IntegrationsListProps {
	filters: IntegrationsFilters;
}

export function IntegrationsList({ filters }: IntegrationsListProps) {
	const [selectedAgent, setSelectedAgent] = useState<Marketplace | null>(null);
	const { marketplace } = useMarketplace();

	const filteredAgents = marketplace.filter((agent) => {
		const matchesSearch =
			agent.name?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
			agent.description?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
			agent.tags?.some((tag) => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()));

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
	agent: Marketplace;
	featured?: boolean;
	onSelect: (agent: Marketplace) => void;
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
						{agent.avatar_url ? <img src={agent.avatar_url} width={80} height={80} alt={agent.name} /> : <Plug className="text-primary" />}
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
					{agent.tags?.map((tag) => (
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
