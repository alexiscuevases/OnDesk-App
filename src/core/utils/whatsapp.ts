export interface WhatsAppMessage {
	messaging_product: "whatsapp";
	to: string;
	type: "text" | "image" | "document" | "video" | "audio" | "location" | "contacts" | "interactive";
	text?: {
		body: string;
		preview_url?: boolean;
	};
	image?: {
		id?: string;
		link?: string;
		caption?: string;
	};
	document?: {
		id?: string;
		link?: string;
		caption?: string;
		filename?: string;
	};
	video?: {
		id?: string;
		link?: string;
		caption?: string;
	};
	audio?: {
		id?: string;
		link?: string;
	};
	location?: {
		latitude: number;
		longitude: number;
		name?: string;
		address?: string;
	};
	contacts?: any[];
	interactive?: any;
}

export interface WhatsAppWebhookMessage {
	from: string;
	id: string;
	timestamp: string;
	type: string;
	text?: {
		body: string;
	};
	image?: {
		id: string;
		mime_type: string;
		sha256: string;
	};
	document?: {
		id: string;
		filename: string;
		mime_type: string;
		sha256: string;
	};
	video?: {
		id: string;
		mime_type: string;
		sha256: string;
	};
	audio?: {
		id: string;
		mime_type: string;
	};
}

export interface WhatsAppWebhookEntry {
	id: string;
	changes: Array<{
		value: {
			messaging_product: string;
			metadata: {
				display_phone_number: string;
				phone_number_id: string;
			};
			contacts?: Array<{
				profile: {
					name: string;
				};
				wa_id: string;
			}>;
			messages?: WhatsAppWebhookMessage[];
			statuses?: Array<{
				id: string;
				recipient_id: string;
				status: string;
				timestamp: string;
			}>;
		};
		field: string;
	}>;
}

export interface WhatsAppWebhookPayload {
	object: string;
	entry: WhatsAppWebhookEntry[];
}

export class WhatsAppAPI {
	private phoneNumberId: string;
	private accessToken: string;
	private apiVersion: string;

	constructor(phoneNumberId: string, accessToken: string, apiVersion: string = "v18.0") {
		this.phoneNumberId = phoneNumberId;
		this.accessToken = accessToken;
		this.apiVersion = apiVersion;
	}

	/**
	 * Obtiene la URL base de la API de WhatsApp
	 */
	private getApiUrl(): string {
		return `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}`;
	}

	/**
	 * Realiza una petición a la API de WhatsApp
	 */
	private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
		const url = `${this.getApiUrl()}${endpoint}`;

		const response = await fetch(url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.accessToken}`,
				...options.headers,
			},
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error?.message || `WhatsApp ${response.status}: ${response.statusText}`);
		}

		return response.json();
	}

	/**
	 * Envía un mensaje de texto
	 */
	async sendTextMessage(to: string, message: string, previewUrl: boolean = false): Promise<any> {
		const payload: WhatsAppMessage = {
			messaging_product: "whatsapp",
			to,
			type: "text",
			text: {
				body: message,
				preview_url: previewUrl,
			},
		};

		return this.makeRequest("/messages", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	/**
	 * Envía una imagen
	 */
	async sendImage(to: string, imageUrl: string, caption?: string): Promise<any> {
		const payload: WhatsAppMessage = {
			messaging_product: "whatsapp",
			to,
			type: "image",
			image: {
				link: imageUrl,
				caption,
			},
		};

		return this.makeRequest("/messages", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	/**
	 * Envía un documento
	 */
	async sendDocument(to: string, documentUrl: string, filename?: string, caption?: string): Promise<any> {
		const payload: WhatsAppMessage = {
			messaging_product: "whatsapp",
			to,
			type: "document",
			document: {
				link: documentUrl,
				caption,
				filename,
			},
		};

		return this.makeRequest("/messages", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	/**
	 * Envía audio
	 */
	async sendAudio(to: string, audioUrl: string): Promise<any> {
		const payload: WhatsAppMessage = {
			messaging_product: "whatsapp",
			to,
			type: "audio",
			audio: {
				link: audioUrl,
			},
		};

		return this.makeRequest("/messages", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	/**
	 * Envía video
	 */
	async sendVideo(to: string, videoUrl: string, caption?: string): Promise<any> {
		const payload: WhatsAppMessage = {
			messaging_product: "whatsapp",
			to,
			type: "video",
			video: {
				link: videoUrl,
				caption,
			},
		};

		return this.makeRequest("/messages", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	/**
	 * Envía ubicación
	 */
	async sendLocation(to: string, latitude: number, longitude: number, name?: string, address?: string): Promise<any> {
		const payload: WhatsAppMessage = {
			messaging_product: "whatsapp",
			to,
			type: "location",
			location: {
				latitude,
				longitude,
				name,
				address,
			},
		};

		return this.makeRequest("/messages", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	/**
	 * Verifica el estado de la conexión
	 */
	async checkStatus(): Promise<any> {
		try {
			const response = await this.makeRequest("/", {
				method: "GET",
			});

			return {
				status: "connected",
				phoneNumber: response.display_phone_number,
				verifiedName: response.verified_name,
			};
		} catch (err: unknown) {
			if (err instanceof Error)
				return {
					status: "error",
					error: err.message,
				};
			else return { status: "error", error: "Unexpected error occurred connecting Whatsapp" };
		}
	}

	/**
	 * Lee un mensaje (marcar como leído)
	 */
	async markAsRead(messageId: string): Promise<any> {
		const payload = {
			messaging_product: "whatsapp",
			status: "read",
			message_id: messageId,
		};

		return this.makeRequest("/messages", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	/**
	 * Obtiene información de un perfil
	 */
	async getProfile(phoneNumber: string): Promise<any> {
		const response = await this.makeRequest(`/${encodeURIComponent(phoneNumber)}`, {
			method: "GET",
		});

		return {
			name: response.profile?.name || phoneNumber,
			phoneNumber: phoneNumber,
		};
	}
}

export function createWhatsAppAPI(phoneNumberId: string, accessToken: string, apiVersion?: string): WhatsAppAPI {
	return new WhatsAppAPI(phoneNumberId, accessToken, apiVersion);
}
