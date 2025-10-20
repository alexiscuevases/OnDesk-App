import { AnalyticsOverview } from "@/components/dashboard/analytics-overview"
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics"
import { AgentComparison } from "@/components/dashboard/agent-comparison"

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
  )
}
