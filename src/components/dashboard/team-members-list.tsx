"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Mail, Loader2, Users } from "lucide-react";
import { ChangeRoleDialog } from "./dialogs/change-role-dialog";
import { useTeam } from "@/hooks/use-team";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function TeamMembersList() {
	const { teamMembers, isLoading, error, removeTeamMember } = useTeam();
	const [removingId, setRemovingId] = useState<string | null>(null);

	const handleRemove = async (id: string) => {
		setRemovingId(id);
		try {
			await removeTeamMember(id);
		} catch (error) {
			console.error("Error removing team member:", error);
		} finally {
			setRemovingId(null);
		}
	};

	if (isLoading) {
		return (
			<Card>
				<CardContent className="p-0">
					<div className="divide-y divide-border">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex items-center justify-between p-6">
								<div className="flex items-center gap-4">
									<Skeleton className="h-10 w-10 rounded-full" />
									<div className="space-y-2">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-3 w-48" />
									</div>
								</div>
								<Skeleton className="h-8 w-20" />
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardContent className="p-8 text-center">
					<p className="text-destructive">Error: {error}</p>
				</CardContent>
			</Card>
		);
	}

	if (teamMembers.length === 0) {
		return (
			<Card>
				<CardContent className="p-8 text-center">
					<Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-semibold mb-2">No hay miembros del equipo todavía</h3>
					<p className="text-muted-foreground">Invita a tu primer miembro del equipo para colaborar.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardContent className="p-0">
				<div className="divide-y divide-border">
					{teamMembers.map((member) => {
						const initials = member.email
							.split("@")[0]
							.split(".")
							.map((n) => n[0])
							.join("")
							.toUpperCase()
							.slice(0, 2);

						return (
							<div key={member.id} className="flex items-center justify-between p-6">
								<div className="flex items-center gap-4">
									<Avatar className="h-10 w-10">
										<AvatarFallback>{initials}</AvatarFallback>
									</Avatar>
									<div>
										<p className="font-medium">{member.email}</p>
										<div className="flex items-center gap-2 mt-1">
											<Mail className="h-3 w-3 text-muted-foreground" />
											<p className="text-xs text-muted-foreground">
												{member.status === "pending" ? "Invitación pendiente" : "Miembro activo"}
											</p>
										</div>
									</div>
								</div>

								<div className="flex items-center gap-4">
									<div className="text-right hidden sm:block">
										<Badge variant={member.status === "active" ? "default" : "outline"}>{member.role}</Badge>
										<p className="text-xs text-muted-foreground mt-1">
											{formatDistanceToNow(new Date(member.created_at), { addSuffix: true, locale: es })}
										</p>
									</div>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon" disabled={removingId === member.id}>
												{removingId === member.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<ChangeRoleDialog member={member}>
												<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Cambiar Rol</DropdownMenuItem>
											</ChangeRoleDialog>
											{member.status === "pending" && <DropdownMenuItem>Reenviar Invitación</DropdownMenuItem>}
											<DropdownMenuSeparator />
											<DropdownMenuItem className="text-destructive" onClick={() => handleRemove(member.id)}>
												{member.status === "pending" ? "Cancelar Invitación" : "Eliminar Miembro"}
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
