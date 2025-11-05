"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTeams } from "@/hooks/use-teams";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function TeamSwitcher() {
	const router = useRouter();
	const { currentTeam, teams, switchTeam, isLoadingTeams, isLoadingCurrentTeam } = useTeams();
	const [switching, setSwitching] = useState(false);

	const handleSelectTeam = async (teamId: string) => {
		if (teamId === currentTeam?.id) return;
		setSwitching(true);

		try {
			await switchTeam(teamId);

			toast.success("Team changed", {
				description: "The team has been changed correctly.",
			});

			router.refresh();
		} catch (error: any) {
			toast.error("Error", {
				description: error.message || "Unable to switch teams",
			});
		} finally {
			setSwitching(false);
		}
	};

	if (isLoadingTeams || isLoadingCurrentTeam) {
		return (
			<div className="flex items-center gap-2 px-2 py-1.5">
				<div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
				<div className="flex-1">
					<div className="h-4 w-24 bg-muted rounded animate-pulse" />
				</div>
			</div>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="w-full justify-between" disabled={switching}>
					<div className="flex items-center gap-2 truncate">
						<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground text-xs font-medium">
							{currentTeam?.name.charAt(0).toUpperCase()}
						</div>
						<span className="truncate font-medium">{currentTeam?.name}</span>
					</div>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-60">
				<DropdownMenuLabel>Equipos</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{teams.map((team) => (
					<DropdownMenuItem key={team.id} onClick={() => handleSelectTeam(team.id)} disabled={switching} className="cursor-pointer">
						<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground text-xs font-medium mr-2">
							{team.name.charAt(0).toUpperCase()}
						</div>
						<span className="flex-1 truncate">{team.name}</span>
						<Check className={cn("ml-auto h-4 w-4", currentTeam?.id === team.id ? "opacity-100" : "opacity-0")} />
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => router.push("/create-team?from=dashboard")} className="cursor-pointer" disabled={switching}>
					<Plus className="mr-2 h-4 w-4" />
					Create new team
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
