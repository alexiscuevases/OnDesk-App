import { supabaseAdmin } from "./supabase/admin";
import { Notification } from "./validations/notification";

interface NewConversation {
	team_id: string;
	conversation_id: string;
}

export class Notifications {
	async newConversation({ team_id, conversation_id }: NewConversation) {
		try {
			const { data, error } = await supabaseAdmin
				.from("notifications")
				.insert({
					team_id,
					title: "New Conversation",
					content: "A new conversation has started",
					type: "info",
					read: false,
					path: `/conversations/${conversation_id}`,
				})
				.select("*")
				.single<Notification>();
			if (error) throw error;

			return data;
		} catch (err: unknown) {
			throw err;
		}
	}
}

export const notifications = new Notifications();
