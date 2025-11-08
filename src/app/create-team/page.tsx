"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Users, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTeams } from "@/hooks/use-teams";
import { CreateTeamInput, createTeamSchema } from "@/lib/validations/team";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AppConfigs } from "@/configs/app";
import { AuthProvider, useAuth } from "@/components/providers/auth-provider";

function CreateTeamContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const fromDashboard = searchParams.get("from") === "dashboard";
	const { createTeam, isLoadingCreateTeam, createTeamError } = useTeams();
	const { profile } = useAuth();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<CreateTeamInput>({
		resolver: zodResolver(createTeamSchema),
	});

	useEffect(() => {
		if (!profile) return;
		setValue("owner_id", profile.id);
	}, [profile]);

	async function onSubmit(data: CreateTeamInput) {
		try {
			await createTeam(data);

			router.push(`${AppConfigs.url}/dashboard`);
		} catch (err) {
			// Error is handled by useTeam hook
		}
	}

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-6">
			<Card className="w-full max-w-2xl">
				<CardHeader className="text-center">
					{fromDashboard && (
						<div className="flex justify-start mb-4">
							<Button variant="secondary" size="sm" asChild>
								<Link href="/dashboard">
									<ArrowLeft className="h-4 w-4 mr-2" />
									Back to dashboard
								</Link>
							</Button>
						</div>
					)}
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
						<Users className="h-6 w-6 text-primary" />
					</div>
					<CardTitle className="text-3xl">{fromDashboard ? "Create new team" : "Build your team"}</CardTitle>
					<CardDescription>
						{fromDashboard ? "Set up a new workspace for your organization" : "Set up your workspace to start using AI agents"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						{createTeamError && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{createTeamError}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label htmlFor="name">
								Nombre del equipo <span className="text-destructive">*</span>
							</Label>
							<Input id="name" type="text" placeholder="Example: My Company" disabled={isLoadingCreateTeam} {...register("name")} />
							<p className="text-xs text-muted-foreground">The name of your team or organization</p>
							{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description (optional)</Label>
							<Textarea
								id="description"
								placeholder="Briefly describe your team or project...."
								disabled={isLoadingCreateTeam}
								{...register("description")}
								className="resize-none"
							/>
							<p className="text-xs text-muted-foreground">Help your team understand the purpose of the workspace</p>
							{errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
						</div>

						<div className="flex flex-col gap-3 pt-4">
							<Button type="submit" className="w-full" size="lg" disabled={isLoadingCreateTeam}>
								{isLoadingCreateTeam && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{fromDashboard ? "Build a team" : "Continue to plan selection"}
							</Button>
							{!fromDashboard && (
								<p className="text-xs text-center text-muted-foreground">
									After creating your team, you can select the plan that best suits your needs.
								</p>
							)}
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

export default function CreateTeamPage() {
	return (
		<AuthProvider>
			<Suspense
				fallback={
					<div className="min-h-screen bg-background flex items-center justify-center p-6">
						<Loader2 className="h-8 w-8 animate-spin text-accent" />
					</div>
				}>
				<CreateTeamContent />
			</Suspense>
		</AuthProvider>
	);
}
