import { CreateAgentDialog } from "@/components/dashboard/create-agent-dialog"
import { AgentsList } from "@/components/dashboard/agents-list"

export default function AgentsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
          <p className="text-muted-foreground mt-1">Create and manage your AI agents</p>
        </div>
        <CreateAgentDialog />
      </div>

      {/* Agents List */}
      <AgentsList />
    </div>
  )
}
