import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { TeamMembersList } from "@/components/dashboard/team-members-list"
import { InviteTeamDialog } from "@/components/dashboard/invite-team-dialog"

export default function TeamPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground mt-1">Manage your team members and their permissions</p>
        </div>
        <InviteTeamDialog>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </InviteTeamDialog>
      </div>

      {/* Team Members List */}
      <TeamMembersList />
    </div>
  )
}
