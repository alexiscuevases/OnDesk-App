import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { TeamMember } from "../validations/team_member";
import { Team } from "../validations/team";
import { AppConfigs } from "@/configs/app";
import { Profile } from "../validations/profile";

const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error("Please define all Supabase environment variables");

export async function updateSession(request: NextRequest) {
	// Permitir rutas publicas
	const publicRoutes = ["/about", "/api", "/blog", "/contact", "/faq", "/legal", "/pricing", "/roadmap"];
	const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route) || request.nextUrl.pathname === "/");
	if (isPublicRoute) return NextResponse.next();

	// Inicializar middleware de Supabase
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, {
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

	// Obtener usuario actual
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Redireccionar a dashboard si está autenticado y intenta acceder a una ruta de autenticación
	if (request.nextUrl.pathname.startsWith("/auth")) {
		if (user && !request.nextUrl.pathname.endsWith("/update-password")) {
			const url = `${AppConfigs.url}/dashboard`;
			return NextResponse.redirect(url);
		} else return NextResponse.next();
	}

	// Redireccionar a sign-in si no está autenticado y intenta acceder a una ruta protegida (fuera de auth)
	if (!user) {
		const url = `${AppConfigs.url}/auth/sign-in`;
		return NextResponse.redirect(url);
	}

	// Gestionar acceso al dashboard
	if (request.nextUrl.pathname.startsWith("/dashboard")) {
		// Obtener el perfil del usuario
		const { data: profile } = await supabase.from("profiles").select("team_id").eq("id", user.id).single<Profile>();

		// Si no tiene un team seleccionado
		if (!profile?.team_id) {
			// Verificar si el usuario pertenece a algún team
			const { data: teamMember } = await supabase
				.from("team_members, teams:team_id(*)")
				.select("*")
				.eq("user_id", user.id)
				.eq("status", "active")
				.single<TeamMember>();
			if (!teamMember) {
				// Si no tiene ningún team, redirigir a create-team
				if (request.nextUrl.pathname !== "/create-team") {
					const url = `${AppConfigs.url}/create-team`;
					return NextResponse.redirect(url);
				}
			} else {
				// Si tiene team pero no tiene ninguno seleccionado, seleccionar automáticamente
				await supabase.from("profiles").update({ team_id: teamMember.team_id }).eq("id", user.id);

				// Redirigir según el estado de la suscripción del team
				if (!teamMember.teams?.stripe_subscription_status || teamMember.teams?.stripe_subscription_status !== "active") {
					if (!request.nextUrl.pathname.startsWith("/select-plan")) {
						const url = `${AppConfigs.url}/select-plan?team_id=${teamMember.team_id}`;
						return NextResponse.redirect(url);
					}
				}
			}
		} else {
			// Verificar el team seleccionado
			const { data: team } = await supabase
				.from("teams")
				.select("id, stripe_subscription_id, stripe_subscription_status")
				.eq("id", profile.team_id)
				.single<Team>();

			if (!team) {
				// El team seleccionado no existe, limpiar y redirigir
				await supabase.from("profiles").update({ team_id: null }).eq("id", user.id);

				const url = `${AppConfigs.url}/create-team`;
				return NextResponse.redirect(url);
			}

			// Redirigir según el estado de la suscripción del team
			if (!team.stripe_subscription_status || team.stripe_subscription_status !== "active") {
				if (!request.nextUrl.pathname.startsWith("/select-plan")) {
					const url = `${AppConfigs.url}/select-plan?team_id=${team.id}`;
					return NextResponse.redirect(url);
				}
			}
		}
	}

	return supabaseResponse;
}
