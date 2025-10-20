"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const agents = [
  { name: "Support Bot", conversations: 1247, satisfaction: 96, responseTime: "0.8s" },
  { name: "Sales Assistant", conversations: 892, satisfaction: 94, responseTime: "1.2s" },
  { name: "Tech Support", conversations: 634, satisfaction: 91, responseTime: "1.5s" },
  { name: "Onboarding Guide", conversations: 423, satisfaction: 98, responseTime: "0.6s" },
]

export function AgentComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Comparison</CardTitle>
        <CardDescription>Performance metrics across all agents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {agents.map((agent) => (
          <div key={agent.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{agent.name}</p>
                <p className="text-sm text-muted-foreground">
                  {agent.conversations} conversations • {agent.responseTime} avg response
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{agent.satisfaction}%</p>
                <p className="text-xs text-muted-foreground">satisfaction</p>
              </div>
            </div>
            <Progress value={agent.satisfaction} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
