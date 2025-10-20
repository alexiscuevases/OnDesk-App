"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, MessageSquare, Settings, MoreVertical, Power } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfigureAgentDialog } from "./configure-agent-dialog"

const agents = [
  {
    id: "1",
    name: "Support Bot",
    description: "Handles customer support inquiries and common questions",
    status: "active",
    conversations: 1247,
    channels: ["WhatsApp", "Website"],
    lastActive: "2 min ago",
  },
  {
    id: "2",
    name: "Sales Assistant",
    description: "Helps customers with product information and pricing",
    status: "active",
    conversations: 892,
    channels: ["Website"],
    lastActive: "5 min ago",
  },
  {
    id: "3",
    name: "Tech Support",
    description: "Provides technical assistance and troubleshooting",
    status: "inactive",
    conversations: 634,
    channels: ["WhatsApp"],
    lastActive: "2 hours ago",
  },
  {
    id: "4",
    name: "Onboarding Guide",
    description: "Guides new users through the onboarding process",
    status: "active",
    conversations: 423,
    channels: ["Website", "WhatsApp"],
    lastActive: "10 min ago",
  },
]

export function AgentsList() {
  const [configureAgent, setConfigureAgent] = useState<{ id: string; name: string; description: string } | null>(null)

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={agent.status === "active" ? "default" : "secondary"} className="text-xs">
                        {agent.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setConfigureAgent(agent)}>
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Power className="mr-2 h-4 w-4" />
                      {agent.status === "active" ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <CardDescription className="leading-relaxed">{agent.description}</CardDescription>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{agent.conversations.toLocaleString()} conversations</span>
                </div>
                <div className="flex items-center gap-2">
                  {agent.channels.map((channel) => (
                    <Badge key={channel} variant="outline" className="text-xs">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs text-muted-foreground">Active {agent.lastActive}</span>
              <Button variant="outline" size="sm" onClick={() => setConfigureAgent(agent)}>
                Configure
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {configureAgent && (
        <ConfigureAgentDialog
          open={!!configureAgent}
          onOpenChange={(open) => !open && setConfigureAgent(null)}
          agent={configureAgent}
        />
      )}
    </>
  )
}
