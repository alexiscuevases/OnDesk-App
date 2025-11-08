"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Star, Download, Clock, User, Package, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { MarketplaceAgent } from "../lists/marketplace-list";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MarketplaceAgentDetailsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	agent: MarketplaceAgent;
}

export function MarketplaceAgentDetailsDialog({ open, onOpenChange, agent }: MarketplaceAgentDetailsDialogProps) {
	const [isInstalling, setIsInstalling] = useState(false);
	const [isInstalled, setIsInstalled] = useState(false);

	const handleInstall = async () => {
		setIsInstalling(true);

		try {
			// Simulate installation process
			await new Promise((resolve) => setTimeout(resolve, 2000));

			setIsInstalled(true);
			toast.success("Agent installed", {
				description: `${agent.name} has been successfully installed to your workspace.`,
			});

			// Close dialog after a short delay
			setTimeout(() => {
				onOpenChange(false);
			}, 1500);
		} catch (err: any) {
			toast.error("Installation failed", {
				description: err.message || "The agent could not be installed. Please try again.",
			});
		} finally {
			setIsInstalling(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<div className="flex items-start gap-4">
						<div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
							<agent.icon className="h-8 w-8 text-primary" />
						</div>
						<div className="flex-1">
							<DialogTitle className="text-2xl">{agent.name}</DialogTitle>
							<DialogDescription className="mt-1">by {agent.author}</DialogDescription>
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
							<p className="text-sm text-muted-foreground leading-relaxed">{agent.longDescription}</p>
						</div>

						<div className="flex flex-wrap gap-2">
							{agent.tags.map((tag) => (
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
								<p className="text-sm font-medium">{agent.lastUpdated}</p>
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-muted-foreground">
									<User className="h-4 w-4" />
									<span className="text-xs">Author</span>
								</div>
								<p className="text-sm font-medium">{agent.author}</p>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="capabilities" className="space-y-3 mt-4">
						<div>
							<h3 className="font-semibold mb-3">What this agent can do</h3>
							<div className="space-y-2">
								{agent.capabilities.map((capability, index) => (
									<div key={index} className="flex items-start gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
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
							{agent.requirements.map((requirement, index) => (
								<div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted">
									<AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
									<span className="text-sm">{requirement}</span>
								</div>
							))}
						</div>
					</TabsContent>
				</Tabs>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={isInstalling}>
						Close
					</Button>
					<Button onClick={handleInstall} disabled={isInstalling || isInstalled}>
						{isInstalling ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Installing...
							</>
						) : isInstalled ? (
							<>
								<CheckCircle2 className="mr-2 h-4 w-4" />
								Installed
							</>
						) : (
							<>
								<Download className="mr-2 h-4 w-4" />
								Install Agent
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
