"use server";

import { platformConfigs } from "@/configs/platform";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function startCheckoutSession(productId: string, teamId: string) {
	const product = platformConfigs.plans.find((p) => p.id === productId);
	if (!product) throw new Error(`Product with id "${productId}" not found`);

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("Not authenticated");

	// Verificar que el usuario sea el owner del team
	const { data: team, error: teamError } = await supabase.from("teams").select("*").eq("id", teamId).eq("owner_id", user.id).single();
	if (teamError || !team) throw new Error("Team not found or you don't have permission");

	// Get or create Stripe customer
	const { data: profile } = await supabase.from("profiles").select("stripe_customer_id, email").eq("id", user.id).single();

	let customerId = profile?.stripe_customer_id;
	if (!customerId) {
		const customer = await stripe.customers.create({
			email: user.email,
			metadata: {
				supabase_user_id: user.id,
			},
		});
		customerId = customer.id;

		// Update profile with Stripe customer ID
		await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
	}

	// Create checkout session
	const session = await stripe.checkout.sessions.create({
		customer: customerId,
		ui_mode: "embedded",
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						description: product.description,
					},
					unit_amount: product.priceInCents,
					recurring: {
						interval: "month",
					},
				},
				quantity: 1,
			},
		],
		mode: "subscription",
		return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/select-plan?session_id={CHECKOUT_SESSION_ID}&team_id=${teamId}`,
		metadata: {
			supabase_user_id: user.id,
			team_id: teamId,
			plan_id: productId,
		},
	});

	return session.client_secret;
}

export async function createPortalSession() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("Not authenticated");

	const { data: profile } = await supabase.from("profiles").select("stripe_customer_id").eq("id", user.id).single();
	if (!profile?.stripe_customer_id) throw new Error("No Stripe customer found");

	const session = await stripe.billingPortal.sessions.create({
		customer: profile.stripe_customer_id,
		return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/settings`,
	});

	return session.url;
}

export async function verifyCheckoutSession(sessionId: string, teamId: string) {
	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status === "paid" && session.status === "complete") {
			// Session is complete, check if subscription is active in database
			const supabase = await createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) return { success: false, error: "Not authenticated" };

			// Verificar que el team tenga una suscripción activa
			const { data: team } = await supabase
				.from("teams")
				.select("stripe_subscription_id, stripe_subscription_status")
				.eq("id", teamId)
				.eq("owner_id", user.id)
				.single();

			// If webhook hasn't processed yet, wait a bit and check again
			if (!team?.stripe_subscription_id || team.stripe_subscription_status !== "active") return { success: false, pending: true };
			return { success: true };
		}

		return { success: false, error: "Payment not completed" };
	} catch (error) {
		console.error("[v0] Error verifying checkout session:", error);
		return { success: false, error: "Failed to verify session" };
	}
}
