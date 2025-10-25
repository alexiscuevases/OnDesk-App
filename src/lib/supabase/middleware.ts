import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
	// Skip for api
	if (request.nextUrl.pathname.startsWith("/api")) return NextResponse.next();

	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
				supabaseResponse = NextResponse.next({
					request,
				});
				cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
			},
		},
	});

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Allow public routes
	const publicRoutes = ["/about", "/auth", "/blog", "/contact", "/faq", "/legal", "/pricing", "/roadmap", "/select-plan"];
	const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

	// Redirect to sign-in if not authenticated and trying to access protected route
	if (!user && !isPublicRoute) {
		const url = request.nextUrl.clone();
		url.pathname = "/auth/sign-in";
		return NextResponse.redirect(url);
	}

	// Check if user has a subscription for dashboard access
	if (user && request.nextUrl.pathname.startsWith("/dashboard")) {
		const { data: profile } = await supabase.from("profiles").select(`team:team_id(*)`).eq("id", user.id).single();

		// Redirect to plan selection if no active subscription
		if (!profile?.team?.stripe_subscription_status || profile.team.stripe_subscription_status !== "active") {
			if (request.nextUrl.pathname !== "/select-plan") {
				const url = request.nextUrl.clone();
				url.pathname = "/select-plan";
				return NextResponse.redirect(url);
			}
		}
	}

	return supabaseResponse;
}
