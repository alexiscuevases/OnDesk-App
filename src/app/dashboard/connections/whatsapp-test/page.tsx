"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useConnectionManager } from "@/hooks/use-connection-manager";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

export default function WhatsAppTestPage() {
	const { connections, isLoading: connectionsLoading, sendWhatsAppMessage } = useConnectionManager();
	const [selectedConnection, setSelectedConnection] = useState<string>("");
	const [to, setTo] = useState("");
	const [message, setMessage] = useState("");
	const [isSending, setIsSending] = useState(false);

	// Filtrar solo conexiones de WhatsApp
	const whatsappConnections = connections.filter((conn) => conn.type === "whatsapp" && conn.status === "connected");

	const handleSend = async () => {
		if (!selectedConnection || !to || !message) {
			toast.error("Error", {
				description: "Por favor completa todos los campos",
			});
			return;
		}

		setIsSending(true);

		try {
			const result = await sendWhatsAppMessage(selectedConnection, to, message);

			if (result) {
				toast.success("Mensaje enviado y conversación creada", {
					description: `ID de conversación: ${result.conversationId.substring(0, 8)}...`,
				});

				// Limpiar el formulario
				setMessage("");

				// Opcional: Redirigir a la conversación
				// setTimeout(() => {
				// 	window.location.href = `/dashboard/conversations/${result.conversationId}`;
				// }, 2000);
			}
		} catch (error: any) {
			toast.error("Error", {
				description: error.message || "No se pudo enviar el mensaje",
			});
		} finally {
			setIsSending(false);
		}
	};

	if (connectionsLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (whatsappConnections.length === 0) {
		return (
			<div className="container mx-auto py-10">
				<Card>
					<CardHeader>
						<CardTitle>No hay conexiones de WhatsApp</CardTitle>
						<CardDescription>Necesitas configurar una conexión de WhatsApp Business antes de poder enviar mensajes de prueba.</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => (window.location.href = "/dashboard/connections")}>Configurar WhatsApp</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10">
			<div className="space-y-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Enviar Mensaje de WhatsApp</h1>
					<p className="text-muted-foreground mt-2">Prueba el envío de mensajes a través de tus conexiones de WhatsApp Business configuradas</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Nuevo Mensaje</CardTitle>
						<CardDescription>Envía un mensaje de prueba a un número de WhatsApp</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="connection">Conexión de WhatsApp</Label>
							<select
								id="connection"
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
								value={selectedConnection}
								onChange={(e) => setSelectedConnection(e.target.value)}>
								<option value="">Selecciona una conexión</option>
								{whatsappConnections.map((conn) => (
									<option key={conn.id} value={conn.id}>
										{conn.name} - {(conn.config as any).phoneNumber}
									</option>
								))}
							</select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="to">Número de Destino</Label>
							<Input id="to" placeholder="+1234567890" value={to} onChange={(e) => setTo(e.target.value)} />
							<p className="text-xs text-muted-foreground">Incluye el código de país. Ejemplo: +521234567890</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="message">Mensaje</Label>
							<Textarea
								id="message"
								placeholder="Escribe tu mensaje aquí..."
								rows={5}
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								maxLength={4096}
							/>
							<p className="text-xs text-muted-foreground">{message.length} / 4096 caracteres</p>
						</div>

						<Button onClick={handleSend} disabled={isSending || !selectedConnection || !to || !message}>
							{isSending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Enviando...
								</>
							) : (
								<>
									<Send className="mr-2 h-4 w-4" />
									Enviar Mensaje
								</>
							)}
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Mensajes Rápidos</CardTitle>
						<CardDescription>Plantillas de mensajes para pruebas rápidas</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						{[
							"¡Hola! Este es un mensaje de prueba de OnDesk.",
							"Gracias por contactarnos. Nuestro horario de atención es de 9:00 AM a 6:00 PM.",
							"Tu solicitud ha sido recibida. Te responderemos en breve.",
							"¿En qué puedo ayudarte hoy?",
						].map((template, index) => (
							<Button
								key={index}
								variant="outline"
								className="w-full justify-start text-left"
								onClick={() => setMessage(template)}
								disabled={!selectedConnection}>
								{template}
							</Button>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
