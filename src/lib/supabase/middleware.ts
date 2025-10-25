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
	const publicRoutes = ["/about", "/auth", "/blog", "/contact", "/faq", "/legal", "/pricing", "/roadmap"];
	const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

	// Redirect to sign-in if not authenticated and trying to access protected route
	if (!user && !isPublicRoute && !request.nextUrl.pathname.startsWith("/create-team") && !request.nextUrl.pathname.startsWith("/select-plan")) {
		const url = request.nextUrl.clone();
		url.pathname = "/auth/sign-in";
		return NextResponse.redirect(url);
	}

	// Check if user has a team and subscription for dashboard/create-team/select-plan access
	if (user && (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname === "/")) {
		// Verificar si el usuario tiene algún team donde sea owner o member
		const { data: teamMember } = await supabase
			.from("team_members")
			.select(
				`
        id,
        team_id,
        role,
        status,
        teams:team_id (
          id,
          name,
          owner_id,
          stripe_subscription_id,
          stripe_subscription_status,
          plan
        )
      `
			)
			.eq("user_id", user.id)
			.eq("status", "active")
			.single();

		// Si no tiene ningún team, redirigir a create-team
		if (!teamMember || !teamMember.teams) {
			if (request.nextUrl.pathname !== "/create-team") {
				const url = request.nextUrl.clone();
				url.pathname = "/create-team";
				return NextResponse.redirect(url);
			}
		} else {
			const team = teamMember.teams;

			// Si tiene team pero no tiene suscripción activa, redirigir a select-plan
			if (!team.stripe_subscription_status || team.stripe_subscription_status !== "active") {
				if (!request.nextUrl.pathname.startsWith("/select-plan")) {
					const url = request.nextUrl.clone();
					url.pathname = `/select-plan?team_id=${team.id}`;
					return NextResponse.redirect(url);
				}
			}
		}
	}

	// Si el usuario está en create-team pero ya tiene un team, redirigir según corresponda
	if (user && request.nextUrl.pathname === "/create-team") {
		const { data: teamMember } = await supabase
			.from("team_members")
			.select(
				`
        teams:team_id (
          id,
          stripe_subscription_status
        )
      `
			)
			.eq("user_id", user.id)
			.eq("status", "active")
			.single();

		if (teamMember?.teams) {
			const team = teamMember.teams;
			// Si ya tiene team con suscripción activa, ir al dashboard
			if (team.stripe_subscription_status === "active") {
				const url = request.nextUrl.clone();
				url.pathname = "/dashboard";
				return NextResponse.redirect(url);
			} else {
				// Si tiene team sin suscripción, ir a select-plan
				const url = request.nextUrl.clone();
				url.pathname = `/select-plan?team_id=${team.id}`;
				return NextResponse.redirect(url);
			}
		}
	}

	return supabaseResponse;
}
