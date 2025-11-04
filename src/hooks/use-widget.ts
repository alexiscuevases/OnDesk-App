"use client";

import { createClient } from "@/lib/supabase/client";
import { Connection } from "@/lib/validations/connection";
import { Conversation } from "@/lib/validations/conversation";
import { StartConversationInput } from "@/lib/validations/widget";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useWidget(connectionId: string) {
	const supabase = createClient();
	const queryClient = useQueryClient();

	const startConversationMutation = useMutation({
		mutationFn: async (input: StartConversationInput) => {
			const { data: connection, error: connectionError } = await supabase.from("connections").select("*").eq("id", connectionId).single<Connection>();
			if (connectionError) throw connectionError;

			const { data: newConversation, error: conversationError } = await supabase
				.from("conversations")
				.insert({
					team_id: connection.team_id,
					connection_id: connectionId,
					customer_name: input.customer_name,
					customer_email: input.customer_email,
					channel: "website",
				})
				.select("*")
				.single<Conversation>();
			if (conversationError) throw conversationError;

			return newConversation;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["widget", "conversations", data.id] });
		},
	});
	const startConversation = async (input: StartConversationInput) => await startConversationMutation.mutateAsync(input);

	return {
		startConversation,
		startConversationIsLoading: startConversationMutation.isPending,
		startConversationError: startConversationMutation.error,
	};
}
