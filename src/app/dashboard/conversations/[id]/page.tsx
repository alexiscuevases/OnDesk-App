import SingleConversationClientPage from "./client-page";

interface Props {
	params: Promise<{
		id: string;
	}>;
}

export default async function SingleConversationPage({ params }: Props) {
	const pageParams = await params;

	return <SingleConversationClientPage conversation_id={pageParams.id} />;
}
