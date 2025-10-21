import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, TrendingUp, Users, Plus, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { RecentConversations } from "@/components/dashboard/recent-conversations";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { redirect } from "next/navigation";
import { verifyCheckoutSession } from "@/app/actions/stripe";

const stats = [
	{
		title: "Total Agents",
		value: "12",
		change: "+2 from last month",
		icon: Bot,
		trend: "up",
	},
	{
		title: "Conversations",
		value: "8,429",
		change: "+18% from last month",
		icon: MessageSquare,
		trend: "up",
	},
	{
		title: "Active Users",
		value: "2,847",
		change: "+12% from last month",
		icon: Users,
		trend: "up",
	},
	{
		title: "Avg Response Time",
		value: "1.2s",
		change: "-0.3s from last month",
		icon: TrendingUp,
		trend: "up",
	},
];

export default async function DashboardPage({ searchParams }: { searchParams: { session_id?: string } }) {
	if (searchParams.session_id) {
		const result = await verifyCheckoutSession(searchParams.session_id);

		if (!result.success) {
			if (result.pending) {
				// Webhook hasn't processed yet, redirect back to select-plan with session_id
				redirect(`/select-plan?session_id=${searchParams.session_id}`);
			} else {
				// Payment failed or error occurred
				redirect("/select-plan?error=payment_failed");
			}
		}

		// Payment verified, redirect to clean dashboard URL
		redirect("/dashboard");
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your agents.</p>
				</div>
				<Button asChild>
					<Link href="/dashboard/agents/new">
						<Plus className="mr-2 h-4 w-4" />
						Create Agent
					</Link>
				</Button>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat, index) => (
					<Card key={index}>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
							<stat.icon className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
								<ArrowUpRight className="h-3 w-3 text-green-500" />
								{stat.change}
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Charts and Activity */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Activity Overview</CardTitle>
						<CardDescription>Your agent conversations over the last 7 days</CardDescription>
					</CardHeader>
					<CardContent>
						<ActivityChart />
					</CardContent>
				</Card>

				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Recent Conversations</CardTitle>
						<CardDescription>Latest interactions with your agents</CardDescription>
					</CardHeader>
					<CardContent>
						<RecentConversations />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
