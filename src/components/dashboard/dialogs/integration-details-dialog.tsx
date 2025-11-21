"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Star, Download, Clock, User, Package, CheckCircle2, AlertCircle, Loader2, Plug } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDate_DistanceToNow } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIntegrations } from "@/hooks/use-integrations";
import { CreateIntegrationInput, Integration, UpdateIntegrationInput, updateIntegrationSchema } from "@/lib/validations/integration";

interface IntegrationDetailsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	integration: Integration;
}

export function IntegrationDetailsDialog({ open, onOpenChange, integration }: IntegrationDetailsDialogProps) {
	const { updateIntegration } = useIntegrations();

	const {
		handleSubmit,
		formState: { isSubmitting, errors },
		setValue,
	} = useForm<UpdateIntegrationInput>({
		resolver: zodResolver(updateIntegrationSchema),
		defaultValues: {
			config: {},
		},
	});

	const onSubmit = async (data: CreateIntegrationInput) => {
		try {
			await updateIntegration(integration.id, data);
			toast.success("Integration updated successfully", {
				description: `${integration.marketplace?.name} has been updated to your workspace.`,
			});
			onOpenChange(false);
		} catch (err: any) {
			toast.error("Update failed", {
				description: err.message || "Could not update integration. Please try again.",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<div className="flex items-start gap-4">
						<div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
							{integration.marketplace?.avatar_url ? (
								<img src={integration.marketplace?.avatar_url} width={80} height={80} alt={integration.marketplace?.name} />
							) : (
								<Plug className="text-primary" />
							)}
						</div>
						<div className="flex-1">
							<DialogTitle className="text-2xl">{integration.marketplace?.name}</DialogTitle>
							<DialogDescription className="mt-1">by {integration.marketplace?.author?.name}</DialogDescription>
							<div className="flex items-center gap-4 mt-2">
								<div className="flex items-center gap-1">
									<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
									<span className="text-sm font-medium">{integration.marketplace?.rating}</span>
								</div>
								<div className="flex items-center gap-1">
									<Download className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">{integration.marketplace?.installs} installs</span>
								</div>
								<Badge variant="secondary">{integration.marketplace?.category}</Badge>
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
							<p className="text-sm text-muted-foreground leading-relaxed">{integration.marketplace?.description}</p>
						</div>

						<div className="flex flex-wrap gap-2">
							{integration.marketplace?.tags?.map((tag) => (
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
								<p className="text-sm font-medium">{integration.marketplace?.version}</p>
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-muted-foreground">
									<Clock className="h-4 w-4" />
									<span className="text-xs">Updated</span>
								</div>
								<p className="text-sm font-medium">{formatDate_DistanceToNow(integration.updated_at)}</p>
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-muted-foreground">
									<User className="h-4 w-4" />
									<span className="text-xs">Author</span>
								</div>
								<p className="text-sm font-medium">{integration.marketplace?.author?.name}</p>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="capabilities" className="space-y-3 mt-4">
						<div>
							<h3 className="font-semibold mb-3">What this agent can do</h3>
							<div className="space-y-2">
								{integration.marketplace?.capabilities?.map((capability, index) => (
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
							{integration.marketplace?.requirements?.map((requirement, index) => (
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
