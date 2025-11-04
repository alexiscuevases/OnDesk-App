import { NextRequest, NextResponse } from "next/server";
import { type WhatsAppWebhookPayload, type WhatsAppWebhookMessage, createWhatsAppAPI } from "@/lib/whatsapp";
import { Connection } from "@/lib/validations/connection";
import { Conversation } from "@/lib/validations/conversation";
import { notifications } from "@/lib/services/notifications";
import { ai } from "@/lib/services/ai";
import { Message } from "@/lib/validations/message";
import { supabaseAdmin } from "@/lib/supabase/admin";

const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN!;
if (!WHATSAPP_VERIFY_TOKEN) throw new Error("Please define all Whatsapp environment variables");

/**
 * GET - Verificación del webhook por WhatsApp
 */
export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const mode = searchParams.get("hub.mode");
	const token = searchParams.get("hub.verify_token");
	const challenge = searchParams.get("hub.challenge");

	// El token debe coincidir con el configurado en tu conexión
	console.log("[WhatsApp] Verification request:", { mode, token, hasChallenge: !!challenge });
	if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
		console.log("[WhatsApp] Verification successful");
		return new Response(challenge || "", {
			status: 200,
			headers: {
				"Content-Type": "text/plain",
			},
		});
	}

	console.log("[WhatsApp] Verification failed");
	return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

/**
 * POST - Recibir mensajes y eventos de WhatsApp
 */
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const payload: WhatsAppWebhookPayload = body;

		// Verificar que es un evento de WhatsApp
		if (payload.object !== "whatsapp_business_account") return NextResponse.json({ error: "Invalid object type" }, { status: 400 });

		// Procesar cada entrada
		for (const entry of payload.entry) {
			for (const change of entry.changes) {
				// Obtener el phone_number_id para encontrar la conexión
				const phoneNumberId = change.value.metadata?.phone_number_id;
				if (!phoneNumberId) continue;

				console.log("[WhatsApp] Processing for phone_number_id:", phoneNumberId);

				// Buscar la conexión por phone_number_id
				const { data: connections } = await supabaseAdmin.from("connections").select("*").eq("type", "whatsapp").eq("status", "connected");
				if (!connections || connections.length === 0) {
					console.log("[WhatsApp] No WhatsApp connections found");
					continue;
				}

				// Buscar la conexión que coincida con este phoneNumberId
				const connection = connections.find((conn: any) => conn.config?.phoneNumberId === phoneNumberId);
				if (!connection) {
					console.log("[WhatsApp] No connection found for phone_number_id:", phoneNumberId);
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
		console.error("[WhatsApp] Error processing webhook:", error);
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
					content = `[Image] ${message.image?.id}`;
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
					content = `[Document] ${message.document?.filename || message.document?.id}`;
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

			let currentConversation = existingConversation;
			if (currentConversation) {
				// Actualizar la conversación
				await supabaseAdmin
					.from("conversations")
					.update({
						updated_at: new Date().toISOString(),
					})
					.eq("id", currentConversation.id);
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

				notifications.newConversation({
					team_id: connection.team_id,
					conversation_id: newConversation.id,
				});

				currentConversation = newConversation;
			}

			// Crear el mensaje
			await supabaseAdmin.from("messages").insert({
				conversation_id: currentConversation.id,
				role: "user",
				content,
				content_type: contentType,
				metadata: {
					whatsapp_message_id: message.id,
				},
			});

			const aiResponse = await ai.generateResponse(currentConversation.id);
			if (aiResponse.message) {
				const whatsapp = createWhatsAppAPI(connection.config.phoneNumberId, connection.config.apiKey);
				await whatsapp.sendTextMessage(message.from, aiResponse.message);

				const { error: messageError } = await supabaseAdmin
					.from("messages")
					.insert({
						conversation_id: currentConversation.id,
						role: "agent",
						content: aiResponse.message,
					})
					.select()
					.single<Message>();
				if (messageError) throw messageError;
			}

			console.log("[WhatsApp] Message processed successfully");
		} catch (error) {
			console.error("[WhatsApp] Error processing message:", error);
		}
	}
}

/**
 * Procesa actualizaciones de estado de mensajes
 */
async function processStatusUpdates(statuses: Array<any>, connection: Connection) {
	for (const status of statuses) {
		try {
			console.log("[WhatsApp] Message Status update:", {
				messageId: status.id,
				recipient: status.recipient_id,
				status: status.status,
				timestamp: status.timestamp,
			});

			// Buscar el mensaje en la base de datos por su metadata.whatsapp_message_id
			const { data: existingMessage, error: findError } = await supabaseAdmin
				.from("messages")
				.select("*")
				.eq("metadata->>whatsapp_message_id", status.id)
				.single<Message>();
			if (findError) {
				console.warn("[WhatsApp] Message not found for status update:", status.id);
				continue;
			}

			// Determinar el nuevo estado interno
			let newStatus: "sent" | "delivered" | "seen" | "failed" | null = null;
			switch (status.status) {
				case "sent":
					newStatus = "sent";
					break;
				case "delivered":
					newStatus = "delivered";
					break;
				case "read":
					newStatus = "seen";
					break;
				case "failed":
					newStatus = "failed";
					break;
				default:
					newStatus = null;
			}

			if (!newStatus) {
				console.log("[WhatsApp] Unknown status type, skipping:", status.status);
				continue;
			}

			// Actualizar el mensaje
			const { error: updateError } = await supabaseAdmin
				.from("messages")
				.update({
					status: newStatus,
					updated_at: new Date().toISOString(),
				})
				.eq("id", existingMessage.id);
			if (updateError) {
				console.error("[WhatsApp] Error updating message status:", updateError);
				continue;
			}

			// Actualizar la conversación si el estado es "read"
			if (newStatus === "seen") {
				await supabaseAdmin
					.from("conversations")
					.update({
						updated_at: new Date().toISOString(),
					})
					.eq("id", existingMessage.conversation_id);
			}

			console.log(`[WhatsApp] Message ${status.id} updated to '${newStatus}'`);
		} catch (error) {
			console.error("[WhatsApp] Error processing message status update:", error);
		}
	}
}
