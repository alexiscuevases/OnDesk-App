import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AppConfigs } from "@/configs/app";
import { Connection } from "@/lib/validations/connection";

export async function GET(request: Request, { params }: { params: Promise<{ connection_id: string }> }) {
	const connectionId = (await params).connection_id;
	const { data: connection, error: teamError } = await supabaseAdmin.from("connections").select("*").eq("id", connectionId).single<Connection>();
	if (teamError || !connection) return new NextResponse("Connection not found", { status: 404 });

	const script = `
        (function() {
            const iframe = document.createElement('iframe');
            iframe.src = "${AppConfigs.url}/widget/${connectionId}";
            iframe.style.position = 'fixed';
            iframe.style.bottom = '26px';
            iframe.style.right = '26px';
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
