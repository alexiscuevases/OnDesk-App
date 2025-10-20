import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const conversations = [
  {
    user: "Alice Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "How do I reset my password?",
    agent: "Support Bot",
    time: "2 min ago",
    status: "active",
  },
  {
    user: "Bob Smith",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "What are your pricing plans?",
    agent: "Sales Bot",
    time: "15 min ago",
    status: "resolved",
  },
  {
    user: "Carol White",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "I need help with integration",
    agent: "Tech Support",
    time: "1 hour ago",
    status: "active",
  },
  {
    user: "David Brown",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "Can I upgrade my plan?",
    agent: "Sales Bot",
    time: "2 hours ago",
    status: "resolved",
  },
]

export function RecentConversations() {
  return (
    <div className="space-y-4">
      {conversations.map((conversation, index) => (
        <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.user} />
            <AvatarFallback>{conversation.user.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{conversation.user}</p>
              <span className="text-xs text-muted-foreground">{conversation.time}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">{conversation.message}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {conversation.agent}
              </Badge>
              <Badge variant={conversation.status === "active" ? "default" : "secondary"} className="text-xs">
                {conversation.status}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
