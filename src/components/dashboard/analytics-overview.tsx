"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, MessageSquare, Users, Clock, CheckCircle } from "lucide-react";
import { useStats } from "@/hooks/use-stats";

export function AnalyticsOverview() {
	const { stats, isLoading } = useStats();

	const statCards = [
		{
			title: "Total Conversations",
			value: stats?.totalConversations.toLocaleString() || "0",
			change: `${(stats?.conversationsChange as number) > 0 ? "+" : ""}${stats?.conversationsChange}%`,
			trend: (stats?.conversationsChange as number) >= 0 ? "up" : "down",
			icon: MessageSquare,
		},
		{
			title: "Active Agents",
			value: stats?.activeAgents.toString() || "0",
			change: `${(stats?.agentsChange as number) > 0 ? "+" : ""}${stats?.agentsChange}%`,
			trend: (stats?.agentsChange as number) >= 0 ? "up" : "down",
			icon: Users,
		},
		{
			title: "Average Response Time",
			value: stats?.avgResponseTime || "0s",
			change: `${(stats?.responseTimeChange as number) > 0 ? "+" : ""}${stats?.responseTimeChange}%`,
			trend: (stats?.responseTimeChange as number) <= 0 ? "up" : "down",
			icon: Clock,
		},
		{
			title: "Satisfaction Rate",
			value: `${stats?.satisfactionRate.toFixed(1) || "0"}%`,
			change: `${(stats?.satisfactionChange as number) > 0 ? "+" : ""}${stats?.satisfactionChange}%`,
			trend: (stats?.satisfactionChange as number) >= 0 ? "up" : "down",
			icon: CheckCircle,
		},
	];

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-20 mb-2" />
							<Skeleton className="h-4 w-32" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{statCards.map((stat) => (
				<Card key={stat.title}>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
						<stat.icon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stat.value}</div>
						<div className="flex items-center gap-1 text-xs mt-1">
							{stat.trend === "up" ? <TrendingUp className="h-3 w-3 text-green-500" /> : <TrendingDown className="h-3 w-3 text-red-500" />}
							<span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
							<span className="text-muted-foreground">since last month</span>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
