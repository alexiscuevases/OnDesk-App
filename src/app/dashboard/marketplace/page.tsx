"use client";

import { MarketplaceList } from "@/components/dashboard/lists/marketplace-list";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export type MarketplaceFilters = {
	searchQuery: string;
	category: string;
};

export default function MarketplacePage() {
	const [filters, setFilters] = useState<MarketplaceFilters>({
		searchQuery: "",
		category: "all",
	});

	const categories = ["all", "Productivity", "Sales", "Support", "Business"];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
				<p className="text-muted-foreground mt-1">Discover and install pre-built agents to enhance your automation</p>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="space-y-4">
					{/* Search Bar */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search agents by name, description, or tags..."
							className="pl-10"
							value={filters.searchQuery}
							onChange={(e) => setFilters((f) => ({ ...f, searchQuery: e.target.value }))}
						/>
					</div>

					{/* Category Tabs */}
					<Tabs value={filters.category} onValueChange={(value) => setFilters((f) => ({ ...f, category: value }))}>
						<TabsList>
							{categories.map((category) => (
								<TabsTrigger key={category} value={category} className="capitalize">
									{category === "all" ? "All Agents" : category}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</CardContent>
			</Card>

			{/* Marketplace List */}
			<MarketplaceList filters={filters} />
		</div>
	);
}
