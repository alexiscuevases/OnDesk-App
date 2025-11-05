"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useTeams } from "@/hooks/use-teams";
import { toast } from "sonner";
import { InviteTeamMemberInput, inviteTeamMemberSchema, TeamMember } from "@/lib/validations/team_member";
import { useTeamMembers } from "@/hooks/use-team_members";
import { TEAM_MEMBER_ROLES_OBJECT } from "@/lib/constants/team_member";

export function InviteTeamDialog({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { currentTeam } = useTeams();
	const { inviteTeamMember } = useTeamMembers(currentTeam?.id as string);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm<InviteTeamMemberInput>({
		resolver: zodResolver(inviteTeamMemberSchema),
	});

	const onSubmit = async (data: InviteTeamMemberInput) => {
		setIsLoading(true);

		try {
			await inviteTeamMember({ ...data, team_id: currentTeam?.id as string });

			toast.success("Invitation sent", {
				description: `An invitation has been sent to ${data.email}.`,
			});

			setOpen(false);
			reset();
		} catch (err: any) {
			toast.error("Error", {
				description: err.message || "Failed to send the invitation",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Invite Team Member</DialogTitle>
						<DialogDescription>Send an invitation to join your workspace</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="invite-email">Email Address</Label>
							<Input id="invite-email" type="email" placeholder="colleague@example.com" {...register("email")} />
							{errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="invite-role">Role</Label>
							<Select value={watch("role")} onValueChange={(value: TeamMember["role"]) => setValue("role", value)}>
								<SelectTrigger id="invite-role">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(TEAM_MEMBER_ROLES_OBJECT).map(([key, label]) => (
										<SelectItem key={key} value={key}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
							<p className="text-xs text-muted-foreground">Admins can manage team members and settings. Members can create and manage agents.</p>
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Sending...
								</>
							) : (
								"Send Invitation"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
