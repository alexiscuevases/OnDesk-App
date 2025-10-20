import { ConversationsList } from "@/components/dashboard/conversations-list"
import { ConversationsFilters } from "@/components/dashboard/conversations-filters"

export default function ConversationsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
        <p className="text-muted-foreground mt-1">View and manage all customer conversations</p>
      </div>

      {/* Filters */}
      <ConversationsFilters />

      {/* Conversations List */}
      <ConversationsList />
    </div>
  )
}
