"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash2, ExternalLink } from "lucide-react";

interface ManageIntegrationDialogProps {
	children: React.ReactNode;
	integration: {
		id: string;
		name: string;
		connectedAccounts: number;
	};
}

export function ManageIntegrationDialog({ children, integration }: ManageIntegrationDialogProps) {
	const [open, setOpen] = useState(false);

	// Mock connected accounts data
	const accounts = [
		{
			id: "1",
			name: "Main Business Account",
			identifier: "+1 (555) 123-4567",
			status: "active",
			connectedAt: "Oct 15, 2025",
		},
		{
			id: "2",
			name: "Support Line",
			identifier: "+1 (555) 987-6543",
			status: "active",
			connectedAt: "Oct 18, 2025",
		},
	];

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Manage {integration.name}</DialogTitle>
					<DialogDescription>View and manage your connected accounts</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{accounts.map((account) => (
						<Card key={account.id}>
							<CardContent className="p-4">
								<div className="flex items-start justify-between">
									<div className="space-y-1 flex-1">
										<div className="flex items-center gap-2">
											<h4 className="font-medium">{account.name}</h4>
											<Badge variant="outline" className="text-xs">
												{account.status}
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground">{account.identifier}</p>
										<p className="text-xs text-muted-foreground">Connected {account.connectedAt}</p>
									</div>
									<div className="flex items-center gap-2">
										<Button variant="ghost" size="icon">
											<ExternalLink className="h-4 w-4" />
										</Button>
										<Button variant="ghost" size="icon" className="text-destructive">
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>

								<div className="mt-4 pt-4 border-t border-border space-y-3">
									<div className="flex items-center justify-between">
										<Label htmlFor={`auto-reply-${account.id}`} className="text-sm">
											Auto-reply enabled
										</Label>
										<Switch id={`auto-reply-${account.id}`} defaultChecked />
									</div>
									<div className="flex items-center justify-between">
										<Label htmlFor={`notifications-${account.id}`} className="text-sm">
											Notifications
										</Label>
										<Switch id={`notifications-${account.id}`} defaultChecked />
									</div>
								</div>
							</CardContent>
						</Card>
					))}
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
