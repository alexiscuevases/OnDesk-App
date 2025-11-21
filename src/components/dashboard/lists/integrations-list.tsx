"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Plug, Star } from "lucide-react";
import { IntegrationsFilters } from "@/app/dashboard/integrations/page";
import { Integration } from "@/lib/validations/integration";
import { useIntegrations } from "@/hooks/use-integrations";
import { IntegrationDetailsDialog } from "../dialogs/integration-details-dialog";

interface IntegrationsListProps {
	filters: IntegrationsFilters;
}

export function IntegrationsList({ filters }: IntegrationsListProps) {
	const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
	const { integrations } = useIntegrations();

	const filteredIntegrations = integrations.filter((integration) => {
		const matchesSearch =
			integration.marketplace?.name?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
			integration.marketplace?.description?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
			integration.marketplace?.tags?.some((tag) => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()));

		const matchesCategory = filters.category === "all" || integration.marketplace?.category === filters.category;
		return matchesSearch && matchesCategory;
	});

	return (
		<>
			<div className="space-y-6">
				{/* All Integrations Grid */}
				<div className="space-y-4">
					{filters.category === "all" && !filters.searchQuery && <h2 className="text-xl font-semibold">All Agents</h2>}
					{filteredIntegrations.length > 0 ? (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{filteredIntegrations.map((integration) => (
								<IntegrationCard key={integration.id} integration={integration} onSelect={setSelectedIntegration} />
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

			{selectedIntegration && (
				<IntegrationDetailsDialog
					open={!!selectedIntegration}
					onOpenChange={(open) => !open && setSelectedIntegration(null)}
					integration={selectedIntegration}
				/>
			)}
		</>
	);
}

interface IntegrationCardProps {
	integration: Integration;
	featured?: boolean;
	onSelect: (agent: Integration) => void;
}

function IntegrationCard({ integration, featured = false, onSelect }: IntegrationCardProps) {
	const marketplace = integration.marketplace;
	if (!marketplace) return null;

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
						{marketplace.avatar_url ? (
							<img src={marketplace.avatar_url} width={80} height={80} alt={marketplace.name} />
						) : (
							<Plug className="text-primary" />
						)}
					</div>
					<div className="flex-1 min-w-0">
						<CardTitle className="text-lg line-clamp-1">{marketplace.name}</CardTitle>
						<div className="flex items-center gap-3 mt-1">
							<div className="flex items-center gap-1">
								<Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
								<span className="text-xs text-muted-foreground">{marketplace.rating}</span>
							</div>
							<span className="text-xs text-muted-foreground">{marketplace.installs} installs</span>
						</div>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				<CardDescription className="line-clamp-2 leading-relaxed">{marketplace.description}</CardDescription>

				<div className="flex flex-wrap gap-1.5">
					{marketplace.tags?.map((tag) => (
						<Badge key={tag} variant="outline" className="text-xs">
							{tag}
						</Badge>
					))}
				</div>

				<div className="flex gap-2 pt-2">
					<Button size="sm" className="flex-1" onClick={() => onSelect(integration)}>
						Install
					</Button>
					<Button size="sm" variant="outline" onClick={() => onSelect(integration)}>
						Details
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
