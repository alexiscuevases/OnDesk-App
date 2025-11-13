"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Star, Download, Clock, User, Package, CheckCircle2, AlertCircle, Loader2, Plug } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Marketplace } from "@/lib/validations/marketplace";
import { formatDate_DistanceToNow } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/providers/auth-provider";
import { useIntegrations } from "@/hooks/use-integrations";
import { CreateIntegrationInput, createIntegrationSchema } from "@/lib/validations/integration";

interface MarketplaceAgentDetailsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	agent: Marketplace;
}

export function MarketplaceAgentDetailsDialog({ open, onOpenChange, agent }: MarketplaceAgentDetailsDialogProps) {
	const { profile } = useAuth();
	const { createIntegration } = useIntegrations();

	const {
		handleSubmit,
		formState: { isSubmitting },
		setValue,
	} = useForm<CreateIntegrationInput>({
		resolver: zodResolver(createIntegrationSchema),
		defaultValues: {
			marketplace_id: agent.id,
		},
	});

	useEffect(() => {
		if (profile?.team_id) setValue("team_id", profile.team_id);
	}, [profile, setValue]);

	const onSubmit = async (data: CreateIntegrationInput) => {
		try {
			await createIntegration(data);
			toast.success("Agent installed successfully", {
				description: `${agent.name} has been added to your workspace.`,
			});
			onOpenChange(false);
		} catch (err: any) {
			toast.error("Installation failed", {
				description: err.message || "Could not install agent. Please try again.",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<div className="flex items-start gap-4">
						<div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
							{agent.avatar_url ? <img src={agent.avatar_url} width={80} height={80} alt={agent.name} /> : <Plug className="text-primary" />}
						</div>
						<div className="flex-1">
							<DialogTitle className="text-2xl">{agent.name}</DialogTitle>
							<DialogDescription className="mt-1">by {agent.author.name}</DialogDescription>
							<div className="flex items-center gap-4 mt-2">
								<div className="flex items-center gap-1">
									<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
									<span className="text-sm font-medium">{agent.rating}</span>
								</div>
								<div className="flex items-center gap-1">
									<Download className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">{agent.installs} installs</span>
								</div>
								<Badge variant="secondary">{agent.category}</Badge>
							</div>
						</div>
					</div>
				</DialogHeader>

				<Separator />

				<Tabs defaultValue="overview" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="capabilities">Capabilities</TabsTrigger>
						<TabsTrigger value="requirements">Requirements</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-4 mt-4">
						<div>
							<h3 className="font-semibold mb-2">About this agent</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{agent.description}</p>
						</div>

						<div className="flex flex-wrap gap-2">
							{agent.tags?.map((tag) => (
								<Badge key={tag} variant="outline">
									{tag}
								</Badge>
							))}
						</div>

						<Separator />

						<div className="grid grid-cols-3 gap-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-muted-foreground">
									<Package className="h-4 w-4" />
									<span className="text-xs">Version</span>
								</div>
								<p className="text-sm font-medium">{agent.version}</p>
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-muted-foreground">
									<Clock className="h-4 w-4" />
									<span className="text-xs">Updated</span>
								</div>
								<p className="text-sm font-medium">{formatDate_DistanceToNow(agent.updated_at)}</p>
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-muted-foreground">
									<User className="h-4 w-4" />
									<span className="text-xs">Author</span>
								</div>
								<p className="text-sm font-medium">{agent.author.name}</p>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="capabilities" className="space-y-3 mt-4">
						<div>
							<h3 className="font-semibold mb-3">What this agent can do</h3>
							<div className="space-y-2">
								{agent.capabilities?.map((capability, index) => (
									<div key={index} className="flex items-start gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
										<span className="text-sm text-muted-foreground">{capability}</span>
									</div>
								))}
							</div>
						</div>
					</TabsContent>

					<TabsContent value="requirements" className="space-y-3 mt-4">
						<Alert>
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>Make sure you have the following before installing this agent:</AlertDescription>
						</Alert>

						<div className="space-y-2">
							{agent.requirements?.map((requirement, index) => (
								<div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted">
									<AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
									<span className="text-sm">{requirement}</span>
								</div>
							))}
						</div>
					</TabsContent>
				</Tabs>

				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogFooter>
						<Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
							Close
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Installing...
								</>
							) : (
								<>
									<Download className="mr-2 h-4 w-4" />
									Install Agent
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
