"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Clock, Bot } from "lucide-react"
import Link from "next/link"

const conversations = [
  {
    id: "1",
    customer: { name: "Alice Johnson", avatar: "/placeholder.svg?height=40&width=40", initials: "AJ" },
    agent: "Support Bot",
    lastMessage: "Thank you for your help! That solved my issue.",
    timestamp: "2 min ago",
    status: "resolved",
    channel: "WhatsApp",
    unread: 0,
  },
  {
    id: "2",
    customer: { name: "Bob Smith", avatar: "/placeholder.svg?height=40&width=40", initials: "BS" },
    agent: "Sales Assistant",
    lastMessage: "Can you tell me more about the pricing plans?",
    timestamp: "5 min ago",
    status: "active",
    channel: "Website",
    unread: 2,
  },
  {
    id: "3",
    customer: { name: "Carol White", avatar: "/placeholder.svg?height=40&width=40", initials: "CW" },
    agent: "Tech Support",
    lastMessage: "I'm having trouble connecting to the API",
    timestamp: "15 min ago",
    status: "active",
    channel: "WhatsApp",
    unread: 1,
  },
  {
    id: "4",
    customer: { name: "David Brown", avatar: "/placeholder.svg?height=40&width=40", initials: "DB" },
    agent: "Onboarding Guide",
    lastMessage: "Great! I've completed the setup process.",
    timestamp: "1 hour ago",
    status: "resolved",
    channel: "Website",
    unread: 0,
  },
  {
    id: "5",
    customer: { name: "Emma Davis", avatar: "/placeholder.svg?height=40&width=40", initials: "ED" },
    agent: "Support Bot",
    lastMessage: "When will the new features be available?",
    timestamp: "2 hours ago",
    status: "pending",
    channel: "WhatsApp",
    unread: 3,
  },
]

export function ConversationsList() {
  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <Card key={conversation.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={conversation.customer.avatar || "/placeholder.svg"}
                    alt={conversation.customer.name}
                  />
                  <AvatarFallback>{conversation.customer.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{conversation.customer.name}</h3>
                    {conversation.unread > 0 && (
                      <Badge variant="default" className="h-5 px-1.5 text-xs">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Bot className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{conversation.agent}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <Badge variant="outline" className="text-xs">
                      {conversation.channel}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{conversation.timestamp}</span>
                </div>
                <Badge
                  variant={
                    conversation.status === "active"
                      ? "default"
                      : conversation.status === "resolved"
                        ? "secondary"
                        : "outline"
                  }
                  className="text-xs"
                >
                  {conversation.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-1">{conversation.lastMessage}</p>
            <div className="flex items-center gap-2 mt-3">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/conversations/${conversation.id}`}>
                  <MessageSquare className="mr-2 h-3 w-3" />
                  View Conversation
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
