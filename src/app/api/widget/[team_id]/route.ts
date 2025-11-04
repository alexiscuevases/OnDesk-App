import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Team } from "@/lib/validations/team";
import { AppConfigs } from "@/configs/app";

export async function GET(request: Request, { params }: { params: Promise<{ team_id: string }> }) {
	const teamId = (await params).team_id;
	const { data: connection, error: teamError } = await supabaseAdmin
		.from("connections")
		.select("*")
		.eq("team_id", teamId)
		.eq("type", "website")
		.single<Team>();
	if (teamError || !connection) return new NextResponse("Connection not found", { status: 404 });

	const script = `
        (function() {
            const iframe = document.createElement('iframe');
            iframe.src = "${AppConfigs.url}/widget?team_id=${teamId}";
            iframe.style.position = 'fixed';
            iframe.style.bottom = '0';
            iframe.style.right = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.zIndex = '999999';
            document.body.appendChild(iframe);

            window.addEventListener('message', function(event) {
                if (event.origin !== "${AppConfigs.url}") return;
                
                if (event.data.type === 'WIDGET_RESIZE') {
                    iframe.style.width = event.data.width;
                    iframe.style.height = event.data.height;
                }
            });
        })();
    `;

	return new NextResponse(script, {
		headers: { "Content-Type": "application/javascript" },
	});
}
