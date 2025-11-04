import WidgetClientPage from "./client-page";

export default async function WidgetPage({ params }: { params: Promise<{ team_id: string }> }) {
	const teamId = (await params).team_id;

	return (
		<div className="w-screen h-screen bg-transparent">
			<WidgetClientPage teamId={teamId} />
		</div>
	);
}
