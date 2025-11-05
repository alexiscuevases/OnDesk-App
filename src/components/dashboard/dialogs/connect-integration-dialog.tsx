"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useConnections } from "@/hooks/use-connections";
import { Connection, CreateConnectionInput, createConnectionSchema } from "@/lib/validations/connection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTeams } from "@/hooks/use-teams";
import { toast } from "sonner";

interface ConnectIntegrationDialogProps {
	children: React.ReactNode;
	integration: {
		name: Connection["name"];
		type: Connection["type"];
	};
}

export function ConnectIntegrationDialog({ children, integration }: ConnectIntegrationDialogProps) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { createConnection } = useConnections();
	const { currentTeam } = useTeams();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<CreateConnectionInput>({
		resolver: zodResolver(createConnectionSchema),
		defaultValues: {
			name: integration.name,
			type: integration.type,
			config: {},
		},
	});

	useEffect(() => {
		if (currentTeam?.id) setValue("team_id", currentTeam.id);
	}, [currentTeam, setValue]);

	const onSubmit = async (data: CreateConnectionInput) => {
		setIsLoading(true);
		try {
			const config: any = {};

			if (integration.type === "whatsapp") {
				config.phoneNumber = data.phoneNumber;
				config.phoneNumberId = data.phoneNumberId;
				config.apiKey = data.apiKey;
				config.accountName = data.accountName;
			} else if (integration.type === "website") {
				config.websiteUrl = data.websiteUrl;
				config.widgetName = data.widgetName;
				config.welcomeMessage = data.welcomeMessage;
			}

			await createConnection({
				team_id: data.team_id,
				name: data.name,
				type: data.type,
				status: "connected",
				config,
			});

			toast.success("Connection created", {
				description: "The connection has been successfully created.",
			});

			setOpen(false);
			reset();
		} catch (err: any) {
			toast.error("Error", {
				description: err.message || "Failed to update the agent",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Connect {integration.name}</DialogTitle>
						<DialogDescription>Configure the integration settings for {integration.name}</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="name">Connection Name</Label>
							<Input id="name" placeholder={integration.name} {...register("name")} />
						</div>

						{integration.type === "whatsapp" && (
							<>
								<div className="space-y-2">
									<Label htmlFor="phoneNumber">Phone Number</Label>
									<Input id="phoneNumber" placeholder="+1234567890" {...register("phoneNumber", { required: true })} />
									{errors.phoneNumber && <p className="text-xs text-destructive">This field is required</p>}
									<p className="text-xs text-muted-foreground">Phone number displayed in WhatsApp Business</p>
								</div>
								<div className="space-y-2">
									<Label htmlFor="phoneNumberId">Phone Number ID</Label>
									<Input id="phoneNumberId" placeholder="123456789012345" {...register("phoneNumberId", { required: true })} />
									{errors.phoneNumberId && <p className="text-xs text-destructive">This field is required</p>}
									<p className="text-xs text-muted-foreground">ID of the number in Meta Business Suite</p>
								</div>
								<div className="space-y-2">
									<Label htmlFor="apiKey">Access Token</Label>
									<Input id="apiKey" type="password" placeholder="EAAxxxxxxxxxxxxx" {...register("apiKey", { required: true })} />
									{errors.apiKey && <p className="text-xs text-destructive">This field is required</p>}
									<p className="text-xs text-muted-foreground">Temporary access token from Meta</p>
								</div>
								<div className="space-y-2">
									<Label htmlFor="accountName">Account Name</Label>
									<Input id="accountName" placeholder="My Business Account" {...register("accountName")} />
								</div>
							</>
						)}

						{integration.type === "website" && (
							<>
								<div className="space-y-2">
									<Label htmlFor="websiteUrl">Website URL</Label>
									<Input id="websiteUrl" placeholder="https://example.com" {...register("websiteUrl", { required: true })} />
									{errors.websiteUrl && <p className="text-xs text-destructive">This field is required</p>}
								</div>
								<div className="space-y-2">
									<Label htmlFor="widgetName">Widget Name</Label>
									<Input id="widgetName" placeholder="Support Chat" {...register("widgetName")} />
								</div>
								<div className="space-y-2">
									<Label htmlFor="welcomeMessage">Welcome Message</Label>
									<Textarea id="welcomeMessage" placeholder="Hi! How can I help you today?" {...register("welcomeMessage")} />
								</div>
							</>
						)}
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Connecting...
								</>
							) : (
								"Connect"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
