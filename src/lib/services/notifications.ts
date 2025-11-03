import { supabaseAdmin } from "../supabase/admin";
import { Notification } from "../validations/notification";

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

			return { success: true, data };
		} catch (err: unknown) {
			if (err instanceof Error) return { success: false, error: err.message };
			return { success: false, error: "Unexpected error occurred creating Notification" };
		}
	}
}

export const notifications = new Notifications();
