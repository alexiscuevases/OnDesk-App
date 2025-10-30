import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { WhatsAppWebhookPayload, WhatsAppWebhookMessage } from "@/lib/whatsapp";
import { Connection } from "@/lib/validations/connection";
import { Conversation } from "@/lib/validations/conversation";

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
});

/**
 * GET - Verificación del webhook por WhatsApp
 */
export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const mode = searchParams.get("hub.mode");
	const token = searchParams.get("hub.verify_token");
	const challenge = searchParams.get("hub.challenge");

	// El token debe coincidir con el configurado en tu conexión
	console.log("[WhatsApp Webhook] Verification request:", { mode, token, hasChallenge: !!challenge });
	if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
		console.log("[WhatsApp Webhook] Verification successful");
		return new Response(challenge || "", {
			status: 200,
			headers: {
				"Content-Type": "text/plain",
			},
		});
	}

	console.log("[WhatsApp Webhook] Verification failed");
	return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

/**
 * POST - Recibir mensajes y eventos de WhatsApp
 */
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const payload: WhatsAppWebhookPayload = body;

		console.log("[WhatsApp Webhook] Received payload:", JSON.stringify(payload, null, 2));

		// Verificar que es un evento de WhatsApp
		if (payload.object !== "whatsapp_business_account") return NextResponse.json({ error: "Invalid object type" }, { status: 400 });

		// Procesar cada entrada
		for (const entry of payload.entry) {
			for (const change of entry.changes) {
				// Obtener el phone_number_id para encontrar la conexión
				const phoneNumberId = change.value.metadata?.phone_number_id;
				if (!phoneNumberId) {
					console.log("[WhatsApp Webhook] No phone_number_id found in change");
					continue;
				}

				console.log("[WhatsApp Webhook] Processing for phone_number_id:", phoneNumberId);

				// Buscar la conexión por phone_number_id
				const { data: connections } = await supabaseAdmin.from("connections").select("*").eq("type", "whatsapp").eq("status", "connected");
				if (!connections || connections.length === 0) {
					console.log("[WhatsApp Webhook] No WhatsApp connections found");
					continue;
				}

				// Buscar la conexión que coincida con este phoneNumberId
				const connection = connections.find((conn: any) => conn.config?.phoneNumberId === phoneNumberId);
				if (!connection) {
					console.log("[WhatsApp Webhook] No connection found for phone_number_id:", phoneNumberId);
					continue;
				}

				// Procesar mensajes entrantes
				if (change.value.messages && change.value.messages.length > 0) {
					await processIncomingMessages(change.value.messages, connection, change.value.contacts);
				}

				// Procesar cambios de estado (delivered, read, etc.)
				if (change.value.statuses && change.value.statuses.length > 0) {
					await processStatusUpdates(change.value.statuses, connection);
				}
			}
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("[WhatsApp Webhook] Error processing webhook:", error);
		return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
	}
}

/**
 * Procesa mensajes entrantes de WhatsApp
 */
async function processIncomingMessages(
	messages: WhatsAppWebhookMessage[],
	connection: Connection,
	contacts?: Array<{ profile: { name: string }; wa_id: string }>
) {
	for (const message of messages) {
		try {
			console.log("[WhatsApp] Processing message:", {
				from: message.from,
				id: message.id,
				type: message.type,
			});

			// Obtener información del contacto
			const contact = contacts?.find((c) => c.wa_id === message.from);
			const contactName = contact?.profile?.name || message.from;

			// Extraer el contenido del mensaje según el tipo
			let content = "";
			let contentType = "text";

			switch (message.type) {
				case "text":
					content = message.text?.body || "";
					contentType = "text";
					break;
				case "image":
					content = `[Imagen] ${message.image?.id}`;
					contentType = "image";
					break;
				case "video":
					content = `[Video] ${message.video?.id}`;
					contentType = "video";
					break;
				case "audio":
					content = `[Audio] ${message.audio?.id}`;
					contentType = "audio";
					break;
				case "document":
					content = `[Documento] ${message.document?.filename || message.document?.id}`;
					contentType = "document";
					break;
				default:
					content = `[${message.type}]`;
					contentType = "other";
			}

			// Buscar o crear la conversación
			const { data: existingConversation } = await supabaseAdmin
				.from("conversations")
				.select("*")
				.eq("connection_id", connection.id)
				.eq("customer_phone", message.from)
				.eq("channel", "whatsapp")
				.eq("status", "open")
				.order("updated_at", { ascending: false })
				.single<Conversation>();

			let conversationId: string;
			if (existingConversation) {
				conversationId = existingConversation.id;

				// Actualizar la conversación
				await supabaseAdmin
					.from("conversations")
					.update({
						updated_at: new Date().toISOString(),
					})
					.eq("id", conversationId);
			} else {
				// Crear nueva conversación
				const { data: newConversation, error: createError } = await supabaseAdmin
					.from("conversations")
					.insert({
						team_id: connection.team_id,
						connection_id: connection.id,
						agent_id: undefined,
						customer_name: contactName,
						customer_phone: message.from,
						channel: "whatsapp",
						status: "open",
						priority: "medium",
					})
					.select("*")
					.single<Conversation>();
				if (createError) {
					console.error("[WhatsApp] Error creating conversation:", createError);
					continue;
				}

				conversationId = newConversation.id;
			}

			// Crear el mensaje
			await supabaseAdmin.from("messages").insert({
				conversation_id: conversationId,
				role: "user",
				content,
				content_type: contentType,
				// metadata: {
				// whatsapp_message_id: message.id,
				// whatsapp_timestamp: message.timestamp,
				// },
			});

			console.log("[WhatsApp] Message processed successfully");
		} catch (error) {
			console.error("[WhatsApp] Error processing message:", error);
		}
	}
}

/**
 * Procesa actualizaciones de estado de mensajes
 */
async function processStatusUpdates(statuses: Array<any>, connection: any) {
	for (const status of statuses) {
		try {
			console.log("[WhatsApp] Status update:", {
				messageId: status.id,
				recipient: status.recipient_id,
				status: status.status,
			});

			// Actualizar el estado del mensaje en la base de datos
			// Por ahora solo registramos el cambio
			// En el futuro, podrías actualizar una columna de estado en la tabla messages

			console.log("[WhatsApp] Status update processed");
		} catch (error) {
			console.error("[WhatsApp] Error processing status update:", error);
		}
	}
}
