"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, TrendingUp, Zap, Plus, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { RecentConversations } from "@/components/dashboard/recent-conversations";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { useStats } from "@/hooks/use-stats";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
	const { stats, isLoading } = useStats();

	const statCards = [
		{
			title: "Total Conversations",
			value: stats?.totalConversations.toLocaleString() || "0",
			change: `${stats?.conversationsChange > 0 ? "+" : ""}${stats?.conversationsChange}%`,
			icon: MessageSquare,
			trend: stats?.conversationsChange >= 0 ? "up" : "down",
		},
		{
			title: "Active Agents",
			value: stats?.activeAgents.toString() || "0",
			change: `${stats?.agentsChange > 0 ? "+" : ""}${stats?.agentsChange}%`,
			icon: Bot,
			trend: stats?.agentsChange >= 0 ? "up" : "down",
		},
		{
			title: "Avg Response Time",
			value: stats?.avgResponseTime || "0s",
			change: `${stats?.responseTimeChange > 0 ? "+" : ""}${stats?.responseTimeChange}%`,
			icon: Zap,
			trend: stats?.responseTimeChange <= 0 ? "up" : "down",
		},
		{
			title: "Satisfaction Rate",
			value: `${stats?.satisfactionRate.toFixed(1) || "0"}%`,
			change: `${stats?.satisfactionChange > 0 ? "+" : ""}${stats?.satisfactionChange}%`,
			icon: TrendingUp,
			trend: stats?.satisfactionChange >= 0 ? "up" : "down",
		},
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground mt-1">Bienvenido! Aquí está lo que está pasando con tus agentes.</p>
				</div>
				<Button asChild>
					<Link href="/dashboard/agents">
						<Plus className="mr-2 h-4 w-4" />
						Crear Agente
					</Link>
				</Button>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{statCards.map((stat, index) => (
					<Card key={index}>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
							<stat.icon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<>
									<Skeleton className="h-8 w-20 mb-2" />
									<Skeleton className="h-4 w-32" />
								</>
							) : (
								<>
									<div className="text-2xl font-bold">{stat.value}</div>
									<p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
										{stat.trend === "up" ? (
											<ArrowUpRight className="h-3 w-3 text-green-500" />
										) : (
											<ArrowDownRight className="h-3 w-3 text-red-500" />
										)}
										{stat.change} desde el mes pasado
									</p>
								</>
							)}
						</CardContent>
					</Card>
				))}
			</div>

			{/* Charts and Activity */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Vista General de Actividad</CardTitle>
						<CardDescription>Conversaciones de tus agentes en los últimos 7 días</CardDescription>
					</CardHeader>
					<CardContent>
						<ActivityChart />
					</CardContent>
				</Card>

				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Conversaciones Recientes</CardTitle>
						<CardDescription>Últimas interacciones con tus agentes</CardDescription>
					</CardHeader>
					<CardContent>
						<RecentConversations />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
