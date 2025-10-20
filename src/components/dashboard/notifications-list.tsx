"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Users, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"

const notifications = [
  {
    id: "1",
    type: "conversation",
    title: "New conversation started",
    description: 'Agent "Support Bot" received a new message from Alice Johnson',
    timestamp: "2 min ago",
    read: false,
    icon: Bot,
  },
  {
    id: "2",
    type: "alert",
    title: "Agent performance alert",
    description: "Response time for Tech Support increased by 15%",
    timestamp: "15 min ago",
    read: false,
    icon: AlertCircle,
  },
  {
    id: "3",
    type: "team",
    title: "Team member invited",
    description: "Sarah Chen joined your workspace as an Admin",
    timestamp: "1 hour ago",
    read: true,
    icon: Users,
  },
  {
    id: "4",
    type: "success",
    title: "Agent deployed successfully",
    description: "Sales Assistant is now live on your website",
    timestamp: "2 hours ago",
    read: true,
    icon: CheckCircle,
  },
  {
    id: "5",
    type: "performance",
    title: "Weekly performance report",
    description: "Your agents handled 3,196 conversations this week (+12.5%)",
    timestamp: "1 day ago",
    read: true,
    icon: TrendingUp,
  },
]

interface NotificationsListProps {
  filter: "all" | "unread"
}

export function NotificationsList({ filter }: NotificationsListProps) {
  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  return (
    <div className="space-y-3">
      {filteredNotifications.map((notification) => (
        <Card
          key={notification.id}
          className={`${!notification.read ? "border-primary/50 bg-primary/5" : ""} hover:bg-accent/50 transition-colors cursor-pointer`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  !notification.read ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <notification.icon
                  className={`h-5 w-5 ${!notification.read ? "text-primary" : "text-muted-foreground"}`}
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                  </div>
                  {!notification.read && (
                    <Badge variant="default" className="text-xs">
                      New
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{notification.timestamp}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {filteredNotifications.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No notifications to display</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
