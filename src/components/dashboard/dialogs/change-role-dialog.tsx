"use client";

import type React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TeamMember } from "@/lib/validations/team_member";
import { useTeamMembers } from "@/hooks/use-team_members";
import { useTeams } from "@/hooks/use-teams";

interface ChangeRoleDialogProps {
	children: React.ReactNode;
	member: TeamMember;
}

export function ChangeRoleDialog({ children, member }: ChangeRoleDialogProps) {
	const [open, setOpen] = useState(false);
	const [selectedRole, setSelectedRole] = useState(member.role);
	const [isLoading, setIsLoading] = useState(false);
	const { currentTeam } = useTeams();
	const { updateTeamMemberRole } = useTeamMembers(currentTeam?.id as string);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await updateTeamMemberRole(member.id, selectedRole);

			toast.success("Role updated", {
				description: `${member.email}'s role has been updated to ${selectedRole}.`,
			});

			setOpen(false);
		} catch (err: any) {
			toast.error("Error", {
				description: err.message || "Failed to update role",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[450px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Change Role</DialogTitle>
						<DialogDescription>Update the role for {member.email}</DialogDescription>
					</DialogHeader>

					<div className="py-6">
						<RadioGroup value={selectedRole} onValueChange={setSelectedRole} className="space-y-4">
							<div className="flex items-start space-x-3 space-y-0">
								<RadioGroupItem value="admin" id="admin" />
								<div className="space-y-1 leading-none">
									<Label htmlFor="admin" className="font-medium cursor-pointer">
										Admin
									</Label>
									<p className="text-sm text-muted-foreground">
										Can manage team members, agents, and all settings. Cannot delete the workspace.
									</p>
								</div>
							</div>

							<div className="flex items-start space-x-3 space-y-0">
								<RadioGroupItem value="member" id="member" />
								<div className="space-y-1 leading-none">
									<Label htmlFor="member" className="font-medium cursor-pointer">
										Member
									</Label>
									<p className="text-sm text-muted-foreground">
										Can create and manage agents, view conversations, and access analytics. Cannot manage team or billing.
									</p>
								</div>
							</div>

							<div className="flex items-start space-x-3 space-y-0">
								<RadioGroupItem value="viewer" id="viewer" />
								<div className="space-y-1 leading-none">
									<Label htmlFor="viewer" className="font-medium cursor-pointer">
										Viewer
									</Label>
									<p className="text-sm text-muted-foreground">Can only view conversations and analytics. Cannot create or modify agents.</p>
								</div>
							</div>
						</RadioGroup>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Updating...
								</>
							) : (
								"Update Role"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
