"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useConnections } from "@/hooks/use-connections";
import { toast } from "sonner";
import { connectionSchema, type ConnectionInput } from "@/lib/validations/connection";

interface ConnectIntegrationDialogProps {
	children: React.ReactNode;
	integration: {
		id: string;
		name: string;
	};
}

export function ConnectIntegrationDialog({ children, integration }: ConnectIntegrationDialogProps) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { createConnection } = useConnections();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<any>({
		defaultValues: {
			name: integration.name,
		},
	});

	const onSubmit = async (data: any) => {
		setIsLoading(true);
		try {
			// Crear la configuración según el tipo de integración
			const config: any = {};

			if (integration.id === "whatsapp") {
				config.phoneNumber = data.phoneNumber;
				config.apiKey = data.apiKey;
				config.accountName = data.accountName;
			} else if (integration.id === "website") {
				config.websiteUrl = data.websiteUrl;
				config.widgetName = data.widgetName;
				config.welcomeMessage = data.welcomeMessage;
			} else if (integration.id === "sms") {
				config.phoneNumber = data.phoneNumber;
				config.provider = data.provider;
				config.apiKey = data.apiKey;
			} else if (integration.id === "email") {
				config.emailAddress = data.emailAddress;
				config.smtpHost = data.smtpHost;
				config.smtpPort = data.smtpPort;
				config.password = data.password;
			}

			const connectionData: ConnectionInput = {
				name: data.name || integration.name,
				type: integration.id,
				config,
				status: "active",
			};

			await createConnection(connectionData);
			toast.success("Conexión creada", {
				description: `${integration.name} ha sido conectado exitosamente.`,
			});
			setOpen(false);
			reset();
		} catch (error: any) {
			toast.error("Error", {
				description: error.message || "No se pudo crear la conexión",
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
						<DialogTitle>Conectar {integration.name}</DialogTitle>
						<DialogDescription>Configura los ajustes de integración de {integration.name}</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="name">Nombre de la Conexión</Label>
							<Input id="name" placeholder={integration.name} {...register("name")} />
						</div>

						{integration.id === "whatsapp" && (
							<>
								<div className="space-y-2">
									<Label htmlFor="phoneNumber">Número de Teléfono</Label>
									<Input id="phoneNumber" placeholder="+1 (555) 000-0000" {...register("phoneNumber", { required: true })} />
									{errors.phoneNumber && <p className="text-xs text-destructive">Este campo es requerido</p>}
								</div>
								<div className="space-y-2">
									<Label htmlFor="apiKey">API Key de WhatsApp Business</Label>
									<Input id="apiKey" type="password" placeholder="Ingresa tu API key" {...register("apiKey", { required: true })} />
									{errors.apiKey && <p className="text-xs text-destructive">Este campo es requerido</p>}
								</div>
								<div className="space-y-2">
									<Label htmlFor="accountName">Nombre de la Cuenta</Label>
									<Input id="accountName" placeholder="Mi Cuenta de Negocio" {...register("accountName")} />
								</div>
							</>
						)}

						{integration.id === "website" && (
							<>
								<div className="space-y-2">
									<Label htmlFor="websiteUrl">URL del Sitio Web</Label>
									<Input id="websiteUrl" placeholder="https://example.com" {...register("websiteUrl", { required: true })} />
									{errors.websiteUrl && <p className="text-xs text-destructive">Este campo es requerido</p>}
								</div>
								<div className="space-y-2">
									<Label htmlFor="widgetName">Nombre del Widget</Label>
									<Input id="widgetName" placeholder="Chat de Soporte" {...register("widgetName")} />
								</div>
								<div className="space-y-2">
									<Label htmlFor="welcomeMessage">Mensaje de Bienvenida</Label>
									<Textarea id="welcomeMessage" placeholder="¡Hola! ¿Cómo puedo ayudarte hoy?" {...register("welcomeMessage")} />
								</div>
							</>
						)}

						{integration.id === "sms" && (
							<>
								<div className="space-y-2">
									<Label htmlFor="phoneNumber">Número de Teléfono</Label>
									<Input id="phoneNumber" placeholder="+1 (555) 000-0000" {...register("phoneNumber", { required: true })} />
									{errors.phoneNumber && <p className="text-xs text-destructive">Este campo es requerido</p>}
								</div>
								<div className="space-y-2">
									<Label htmlFor="provider">Proveedor SMS</Label>
									<Input id="provider" placeholder="Twilio, MessageBird, etc." {...register("provider", { required: true })} />
									{errors.provider && <p className="text-xs text-destructive">Este campo es requerido</p>}
								</div>
								<div className="space-y-2">
									<Label htmlFor="apiKey">API Key</Label>
									<Input id="apiKey" type="password" placeholder="Ingresa tu API key" {...register("apiKey", { required: true })} />
									{errors.apiKey && <p className="text-xs text-destructive">Este campo es requerido</p>}
								</div>
							</>
						)}

						{integration.id === "email" && (
							<>
								<div className="space-y-2">
									<Label htmlFor="emailAddress">Dirección de Email</Label>
									<Input id="emailAddress" type="email" placeholder="support@example.com" {...register("emailAddress", { required: true })} />
									{errors.emailAddress && <p className="text-xs text-destructive">Este campo es requerido</p>}
								</div>
								<div className="space-y-2">
									<Label htmlFor="smtpHost">Host SMTP</Label>
									<Input id="smtpHost" placeholder="smtp.example.com" {...register("smtpHost", { required: true })} />
									{errors.smtpHost && <p className="text-xs text-destructive">Este campo es requerido</p>}
								</div>
								<div className="space-y-2">
									<Label htmlFor="smtpPort">Puerto SMTP</Label>
									<Input id="smtpPort" placeholder="587" {...register("smtpPort", { required: true })} />
									{errors.smtpPort && <p className="text-xs text-destructive">Este campo es requerido</p>}
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Contraseña</Label>
									<Input id="password" type="password" placeholder="Ingresa la contraseña" {...register("password", { required: true })} />
									{errors.password && <p className="text-xs text-destructive">Este campo es requerido</p>}
								</div>
							</>
						)}
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
							Cancelar
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Conectando...
								</>
							) : (
								"Conectar"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
