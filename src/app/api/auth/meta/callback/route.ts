import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const code = searchParams.get("code");

	if (!code) {
		return NextResponse.json({ error: "No code provided" }, { status: 400 });
	}

	try {
		// 1. Intercambiar el code por un access token
		const tokenResponse = await fetch(
			`https://graph.facebook.com/v19.0/oauth/access_token?` +
				`client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&` +
				`client_secret=${process.env.META_APP_SECRET}&` +
				`redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_META_REDIRECT_URI!)}&` +
				`code=${code}`
		);

		const tokenData = await tokenResponse.json();
		const access_token = tokenData.access_token;
		if (!access_token) throw new Error("No access token received");

		// 2. Obtener información del token
		const debugTokenResponse = await fetch(
			`https://graph.facebook.com/v19.0/debug_token?` +
				`input_token=${access_token}&` +
				`access_token=${process.env.NEXT_PUBLIC_META_APP_ID}|${process.env.META_APP_SECRET}`
		);
		const debugData = await debugTokenResponse.json();
		const userId = debugData.data.user_id;

		// 3. Obtener WhatsApp Business Accounts del usuario
		const wabaResponse = await fetch(
			`https://graph.facebook.com/v19.0/${userId}/businesses?` +
				`fields=id,name,owned_whatsapp_business_accounts{id,name,phone_numbers{id,display_phone_number,verified_name}}&` +
				`access_token=${access_token}`
		);
		const wabaData = await wabaResponse.json();

		// 4. Encontrar el negocio con WABAs y phone numbers
		let selectedWaba = null;
		let selectedPhoneNumber = null;

		for (const business of wabaData.data) {
			if (business.owned_whatsapp_business_accounts?.data) {
				for (const waba of business.owned_whatsapp_business_accounts.data) {
					// Verificar si este WABA tiene phone_numbers
					if (waba.phone_numbers?.data && waba.phone_numbers.data.length > 0) {
						selectedWaba = waba;
						selectedPhoneNumber = waba.phone_numbers.data[0];
						break;
					}
				}
			}

			if (selectedWaba) break;
		}

		if (!selectedWaba || !selectedPhoneNumber) throw new Error("No WhatsApp Business Account with phone numbers found");

		// 5. Enviar datos al frontend via postMessage
		const html = `
            <!DOCTYPE html>
            <html>
                <head>
                <title>WhatsApp Connection</title>
                <style>
                    body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: #f0f2f5;
                    }
                    .success {
                    text-align: center;
                    padding: 2rem;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }
                    .checkmark {
                    color: #25D366;
                    font-size: 48px;
                    margin-bottom: 1rem;
                    }
                </style>
                </head>
                <body>
                <div class="success">
                    <div class="checkmark">✓</div>
                    <h3>WhatsApp conectado exitosamente</h3>
                    <p>${selectedPhoneNumber.display_phone_number}</p>
                    <p style="color: #666; font-size: 14px;">Puedes cerrar esta ventana</p>
                </div>
                <script>
                    if (window.opener) {
                    window.opener.postMessage({
                        type: 'META_WHATSAPP_CONNECTED',
                        payload: {
                        phone_number: '${selectedPhoneNumber.display_phone_number}',
                        phone_number_id: '${selectedPhoneNumber.id}',
                        api_key: '${access_token}',
                        account_name: '${selectedWaba.name}'
                        }
                    }, '*');
                    setTimeout(() => window.close(), 2000);
                    }
                </script>
                </body>
            </html>
        `;

		return new NextResponse(html, {
			headers: { "Content-Type": "text/html" },
		});
	} catch (error: any) {
		console.error("Error in Meta callback:", error);

		const errorHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                <title>Error</title>
                <style>
                    body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: #f0f2f5;
                    }
                    .error {
                    text-align: center;
                    padding: 2rem;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }
                    .error-icon {
                    color: #dc2626;
                    font-size: 48px;
                    margin-bottom: 1rem;
                    }
                </style>
                </head>
                <body>
                <div class="error">
                    <div class="error-icon">✕</div>
                    <h3>Error al conectar WhatsApp</h3>
                    <p style="color: #666;">${error.message}</p>
                    <p style="color: #999; font-size: 14px;">Esta ventana se cerrará automáticamente</p>
                </div>
                <script>
                    if (window.opener) {
                    window.opener.postMessage({
                        type: 'META_WHATSAPP_ERROR',
                        error: '${error.message}'
                    }, '*');
                    }
                    setTimeout(() => window.close(), 3000);
                </script>
                </body>
            </html>
        `;

		return new NextResponse(errorHtml, {
			status: 500,
			headers: { "Content-Type": "text/html" },
		});
	}
}
