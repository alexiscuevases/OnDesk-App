"use client";

import type React from "react";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ChangeRoleDialogProps {
	children: React.ReactNode;
	member: {
		name: string;
		currentRole: string;
	};
}

export function ChangeRoleDialog({ children, member }: ChangeRoleDialogProps) {
	const [open, setOpen] = useState(false);
	const [selectedRole, setSelectedRole] = useState(member.currentRole.toLowerCase());

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle role change logic here
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[450px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Change Role</DialogTitle>
						<DialogDescription>Update the role for {member.name}</DialogDescription>
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
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button type="submit">Update Role</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
