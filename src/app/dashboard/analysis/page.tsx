import { AnalyticsOverview } from '@/modules/dashboard/analytics-overview';
import { PerformanceMetrics } from '@/modules/dashboard/performance-metrics';
import { AgentComparison } from '@/modules/dashboard/agent-comparison';

export default function AnalysisPage() {
	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Analysis</h1>
				<p className="text-muted-foreground mt-1">Deep insights into your agents' performance</p>
			</div>

			{/* Analytics Overview */}
			<AnalyticsOverview />

			{/* Performance Metrics */}
			<PerformanceMetrics />

			{/* Agent Comparison */}
			<AgentComparison />
		</div>
	);
}
