"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Mon", conversations: 245, resolved: 231 },
  { name: "Tue", conversations: 312, resolved: 298 },
  { name: "Wed", conversations: 289, resolved: 275 },
  { name: "Thu", conversations: 356, resolved: 341 },
  { name: "Fri", conversations: 401, resolved: 385 },
  { name: "Sat", conversations: 198, resolved: 189 },
  { name: "Sun", conversations: 167, resolved: 162 },
]

export function PerformanceMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Performance</CardTitle>
        <CardDescription>Conversations vs. resolved issues over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            conversations: {
              label: "Conversations",
              color: "hsl(var(--chart-1))",
            },
            resolved: {
              label: "Resolved",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="conversations" fill="var(--color-conversations)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" fill="var(--color-resolved)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
