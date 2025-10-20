"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Mail } from "lucide-react";
import { ChangeRoleDialog } from "./change-role-dialog";

const teamMembers = [
	{
		id: "1",
		name: "John Doe",
		email: "john@example.com",
		role: "Owner",
		avatar: "/placeholder.svg?height=40&width=40",
		status: "active",
		joinedDate: "Jan 2024",
	},
	{
		id: "2",
		name: "Sarah Johnson",
		email: "sarah@example.com",
		role: "Admin",
		avatar: "/placeholder.svg?height=40&width=40",
		status: "active",
		joinedDate: "Mar 2024",
	},
	{
		id: "3",
		name: "Mike Chen",
		email: "mike@example.com",
		role: "Member",
		avatar: "/placeholder.svg?height=40&width=40",
		status: "active",
		joinedDate: "Jun 2024",
	},
	{
		id: "4",
		name: "Emily Davis",
		email: "emily@example.com",
		role: "Member",
		avatar: "/placeholder.svg?height=40&width=40",
		status: "invited",
		joinedDate: "Invited Oct 2025",
	},
];

export function TeamMembersList() {
	return (
		<Card>
			<CardContent className="p-0">
				<div className="divide-y divide-border">
					{teamMembers.map((member) => (
						<div key={member.id} className="flex items-center justify-between p-6">
							<div className="flex items-center gap-4">
								<Avatar className="h-10 w-10">
									<AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
									<AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">{member.name}</p>
									<div className="flex items-center gap-2 mt-1">
										<Mail className="h-3 w-3 text-muted-foreground" />
										<p className="text-sm text-muted-foreground">{member.email}</p>
									</div>
								</div>
							</div>

							<div className="flex items-center gap-4">
								<div className="text-right hidden sm:block">
									<Badge variant={member.status === "active" ? "default" : "outline"}>{member.role}</Badge>
									<p className="text-xs text-muted-foreground mt-1">{member.joinedDate}</p>
								</div>

								{member.role !== "Owner" && (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<ChangeRoleDialog member={member}>
												<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Change Role</DropdownMenuItem>
											</ChangeRoleDialog>
											{member.status === "invited" && <DropdownMenuItem>Resend Invitation</DropdownMenuItem>}
											<DropdownMenuSeparator />
											<DropdownMenuItem className="text-destructive">
												{member.status === "invited" ? "Cancel Invitation" : "Remove Member"}
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
