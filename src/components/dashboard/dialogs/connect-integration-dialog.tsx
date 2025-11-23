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

	const startWhatsappSignup = () => {
		const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&redirect_uri=${encodeURIComponent(
			process.env.NEXT_PUBLIC_META_REDIRECT_URI!
		)}&scope=business_management,whatsapp_business_messaging`;

		const popup = window.open(url, "_blank", "width=600,height=800");

		// Poll para recibir los datos del backend (cuando el callback termine)
		const listener = (event: MessageEvent) => {
			if (event.data.type === "META_WHATSAPP_CONNECTED") {
				popup?.close();
				window.removeEventListener("message", listener);
				finishWhatsappConnection(event.data.payload);
			}
		};

		window.addEventListener("message", listener);
	};

	const finishWhatsappConnection = async (metaData: any) => {
		setIsLoading(true);
		try {
			await createConnection({
				team_id: currentTeam!.id,
				name: integration.name,
				type: "whatsapp",
				status: "connected",
				config: {
					phoneNumber: metaData.phone_number,
					phoneNumberId: metaData.phone_number_id,
					apiKey: metaData.api_key,
					accountName: metaData.account_name,
				},
			});

			toast.success("WhatsApp connected", {
				description: "The WhatsApp account has been linked successfully.",
			});

			setOpen(false);
			reset();
		} catch (err: any) {
			toast.error("Error", {
				description: err.message,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const onSubmit = async (data: CreateConnectionInput) => {
		setIsLoading(true);
		try {
			const config: any = {};

			if (integration.type === "website") {
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
							<div className="flex flex-col items-center justify-center py-4">
								<p className="text-sm text-muted-foreground mb-2">Connect automatically with Meta</p>

								<Button type="button" onClick={startWhatsappSignup} disabled={isLoading}>
									{isLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Connecting...
										</>
									) : (
										"Sync WhatsApp"
									)}
								</Button>
							</div>
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

					{integration.type !== "whatsapp" && (
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
					)}
				</form>
			</DialogContent>
		</Dialog>
	);
}
