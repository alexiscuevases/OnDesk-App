import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
	// Allow public routes
	const publicRoutes = ["/about", "/api", "/auth", "/blog", "/contact", "/faq", "/legal", "/pricing", "/roadmap"];
	const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
	if (isPublicRoute) return NextResponse.next();

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

	// Redirect to sign-in if not authenticated and trying to access protected route
	if (!user) {
		const url = request.nextUrl.clone();
		url.pathname = "/auth/sign-in";
		return NextResponse.redirect(url);
	}

	// Check if user has a team and subscription for dashboard access
	if (request.nextUrl.pathname.startsWith("/dashboard")) {
		// Obtener el profile del usuario para ver qué team tiene seleccionado
		const { data: profile } = await supabase.from("profiles").select("team_id").eq("id", user.id).single();

		// Si no tiene un team seleccionado, verificar si tiene algún team
		if (!profile?.team_id) {
			// Verificar si el usuario pertenece a algún team
			const { data: teamMembers } = await supabase
				.from("team_members")
				.select("team_id, teams:team_id(*)")
				.eq("user_id", user.id)
				.eq("status", "active")
				.limit(1);

			// Si no tiene ningún team, redirigir a create-team
			if (!teamMembers || teamMembers.length === 0) {
				if (request.nextUrl.pathname !== "/create-team") {
					const url = request.nextUrl.clone();
					url.pathname = "/create-team";
					return NextResponse.redirect(url);
				}
			} else {
				// Si tiene teams pero no tiene ninguno seleccionado, seleccionar el primero automáticamente
				const firstTeam = teamMembers[0].teams;
				await supabase.from("profiles").update({ team_id: firstTeam.id }).eq("id", user.id);

				// Redirigir según el estado de la suscripción del team
				if (!firstTeam.stripe_subscription_status || firstTeam.stripe_subscription_status !== "active") {
					const url = request.nextUrl.clone();
					url.pathname = `/select-plan?team_id=${firstTeam.id}`;
					return NextResponse.redirect(url);
				}
			}
		} else {
			// Verificar el team seleccionado
			const { data: team } = await supabase
				.from("teams")
				.select("id, stripe_subscription_id, stripe_subscription_status")
				.eq("id", profile.team_id)
				.single();

			if (!team) {
				// El team seleccionado no existe, limpiar y redirigir
				await supabase.from("profiles").update({ team_id: null }).eq("id", user.id);
				const url = request.nextUrl.clone();
				url.pathname = "/create-team";
				return NextResponse.redirect(url);
			}

			// Si el team no tiene suscripción activa, redirigir a select-plan
			if (!team.stripe_subscription_status || team.stripe_subscription_status !== "active") {
				if (!request.nextUrl.pathname.startsWith("/select-plan")) {
					const url = request.nextUrl.clone();
					url.pathname = `/select-plan?team_id=${team.id}`;
					return NextResponse.redirect(url);
				}
			}
		}
	}

	return supabaseResponse;
}
