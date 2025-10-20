import { ConnectionsList } from "@/components/dashboard/connections-list"

export default function ConnectionsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Connections</h1>
        <p className="text-muted-foreground mt-1">Connect your agents to WhatsApp, websites, and other platforms</p>
      </div>

      {/* Connections List */}
      <ConnectionsList />
    </div>
  )
}
