import WidgetClientPage from "./client-page";

export default async function WidgetPage({ params }: { params: Promise<{ connection_id: string }> }) {
	const connectionId = (await params).connection_id;

	return (
		<div className="w-screen h-screen bg-transparent">
			<WidgetClientPage connectionId={connectionId} />
		</div>
	);
}
