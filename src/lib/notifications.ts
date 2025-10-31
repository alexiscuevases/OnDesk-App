import { createClient } from "./supabase/server";
import { Notification } from "./validations/notification";

export class Notifications {
	async newIncomingMessage({ team_id, conversation_id }: { team_id: string; conversation_id: string }) {
		try {
			const supabase = await createClient();

			const { data, error } = await supabase
				.from("notifications")
				.insert({
					team_id,
					title: "New Message",
					content: "Has recibido un nuevo mensaje",
					type: "info",
					read: false,
					path: `/conversations/${conversation_id}`,
				})
				.select("*")
				.single<Notification>();
			if (error) throw error;

			return data;
		} catch (err: any) {
			throw err;
		}
	}
}

export const notifications = new Notifications();
