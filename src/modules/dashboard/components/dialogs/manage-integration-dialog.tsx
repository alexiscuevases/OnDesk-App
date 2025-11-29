"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Card, CardContent } from "@/ui/card";
import { Switch } from "@/ui/switch";
import { Label } from "@/ui/label";
import { Trash2, ExternalLink } from "lucide-react";
import { useConnections } from "@/modules/connections/hooks/use-connections";
import { Connection } from "@/modules/connections/validations/connection";
import { toast } from "sonner";
import { formatDate } from "@/core/utils/utils";

interface ManageIntegrationDialogProps {
	children: React.ReactNode;
	integration: {
		name: Connection["name"];
		type: Connection["type"];
	};
	connections: Connection[];
}

export function ManageIntegrationDialog({ children, integration, connections }: ManageIntegrationDialogProps) {
	const [open, setOpen] = useState(false);
	const { deleteConnection, updateConnection } = useConnections();

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this connection?")) {
			await deleteConnection(id);
		}
	};

	const handleToggleStatus = async (connection: Connection) => {
		const status = connection.status === "connected" ? "disconnected" : "connected";
		await updateConnection(connection.id, { status });
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Manage {integration.name}</DialogTitle>
					<DialogDescription>View and manage your connected accounts</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{connections.length === 0 ? (
						<p className="text-center text-muted-foreground">No connections configured</p>
					) : (
						connections.map((connection) => {
							const config = connection.config as any;
							const identifier = integration.type === "whatsapp" ? config.phoneNumber : config.websiteUrl;

							return (
								<Card key={connection.id}>
									<CardContent className="p-4">
										<div className="flex items-start justify-between">
											<div className="space-y-1 flex-1">
												<div className="flex items-center gap-2">
													<h4 className="font-medium">{connection.name}</h4>
													<Badge variant={connection.status === "connected" ? "default" : "outline"} className="text-xs">
														{connection.status === "connected"
															? "Connected"
															: connection.status === "error"
															? "Error"
															: "Disconnected"}
													</Badge>
												</div>
												<p className="text-sm text-muted-foreground">{identifier}</p>
												<p className="text-xs text-muted-foreground">Since {formatDate(connection.created_at)}</p>
											</div>
											<div className="flex items-center gap-2">
												<Button variant="ghost" size="icon" onClick={() => toast.info("Feature in development")}>
													<ExternalLink className="h-4 w-4" />
												</Button>
												<Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(connection.id)}>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>

										<div className="mt-4 pt-4 border-t border-border space-y-3">
											<div className="flex items-center justify-between">
												<Label htmlFor={`status-${connection.id}`} className="text-sm">
													{connection.status === "connected" ? "Connected" : "Disconnected"}
												</Label>
												<Switch
													id={`status-${connection.id}`}
													checked={connection.status === "connected"}
													onCheckedChange={() => handleToggleStatus(connection)}
												/>
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
