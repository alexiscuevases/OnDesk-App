"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const notificationSettings = [
  {
    category: "Conversations",
    settings: [
      {
        id: "new-conversation",
        label: "New conversation started",
        description: "Get notified when a new conversation begins",
      },
      {
        id: "conversation-resolved",
        label: "Conversation resolved",
        description: "Get notified when a conversation is marked as resolved",
      },
    ],
  },
  {
    category: "Agents",
    settings: [
      {
        id: "agent-performance",
        label: "Agent performance alerts",
        description: "Get notified about significant performance changes",
      },
      { id: "agent-offline", label: "Agent goes offline", description: "Get notified when an agent becomes inactive" },
    ],
  },
  {
    category: "Team",
    settings: [
      { id: "team-invite", label: "Team member invited", description: "Get notified when someone joins your team" },
      { id: "team-activity", label: "Team activity", description: "Get notified about important team actions" },
    ],
  },
]

export function NotificationsSettings() {
  return (
    <div className="space-y-6">
      {notificationSettings.map((category) => (
        <Card key={category.category}>
          <CardHeader>
            <CardTitle>{category.category}</CardTitle>
            <CardDescription>Manage {category.category.toLowerCase()} notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between space-x-4">
                <div className="flex-1 space-y-1">
                  <Label htmlFor={setting.id} className="text-sm font-medium">
                    {setting.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <Switch id={setting.id} defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
