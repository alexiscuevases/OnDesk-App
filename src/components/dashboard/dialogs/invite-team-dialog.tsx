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
import { useTeam } from "@/hooks/use-team";
import { toast } from "sonner";
import { InviteTeamMemberInput, inviteTeamMemberSchema, TeamMember } from "@/lib/validations/team_member";

export function InviteTeamDialog({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { inviteTeamMember, currentTeam } = useTeam();

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
		if (!currentTeam) {
			toast.error("Error", {
				description: "No se encontró el equipo actual",
			});
			return;
		}

		setIsLoading(true);
		try {
			await inviteTeamMember({ ...data, team_id: currentTeam.id });
			toast.success("Invitación enviada", {
				description: `Se ha enviado una invitación a ${data.email}.`,
			});
			setOpen(false);
			reset();
		} catch (error: any) {
			toast.error("Error", {
				description: error.message || "No se pudo enviar la invitación",
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
						<DialogTitle>Invitar Miembro del Equipo</DialogTitle>
						<DialogDescription>Envía una invitación para unirse a tu espacio de trabajo</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="invite-email">Dirección de Email</Label>
							<Input id="invite-email" type="email" placeholder="colega@ejemplo.com" {...register("email")} />
							{errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="invite-role">Rol</Label>
							<Select value={watch("role")} onValueChange={(value: TeamMember["role"]) => setValue("role", value)}>
								<SelectTrigger id="invite-role">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="admin">Admin</SelectItem>
									<SelectItem value="member">Miembro</SelectItem>
									<SelectItem value="viewer">Viewer</SelectItem>
								</SelectContent>
							</Select>
							{errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
							<p className="text-xs text-muted-foreground">
								Los Admins pueden gestionar miembros del equipo y configuraciones. Los Miembros pueden crear y gestionar agentes.
							</p>
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
							Cancelar
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Enviando...
								</>
							) : (
								"Enviar Invitación"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
