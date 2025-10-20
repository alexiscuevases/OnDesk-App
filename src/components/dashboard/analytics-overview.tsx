"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, MessageSquare, Users, Clock, CheckCircle } from "lucide-react"

const stats = [
  {
    title: "Total Conversations",
    value: "3,196",
    change: "+12.5%",
    trend: "up",
    icon: MessageSquare,
  },
  {
    title: "Active Users",
    value: "1,847",
    change: "+8.2%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Avg Response Time",
    value: "1.2s",
    change: "-15.3%",
    trend: "up",
    icon: Clock,
  },
  {
    title: "Resolution Rate",
    value: "94.3%",
    change: "+2.1%",
    trend: "up",
    icon: CheckCircle,
  },
]

export function AnalyticsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
