"use server";

import { stripe } from "@/lib/stripe";
import { PRODUCTS } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";

export async function startCheckoutSession(productId: string) {
	const product = PRODUCTS.find((p) => p.id === productId);
	if (!product) {
		throw new Error(`Product with id "${productId}" not found`);
	}

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("Not authenticated");
	}

	// Get or create Stripe customer
	const { data: profile } = await supabase.from("profiles").select("stripe_customer_id, email").eq("id", user.id).single();

	let customerId = profile?.stripe_customer_id;

	if (!customerId) {
		const customer = await stripe.customers.create({
			email: profile?.email || user.email,
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
		return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
		metadata: {
			supabase_user_id: user.id,
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

	if (!user) {
		throw new Error("Not authenticated");
	}

	const { data: profile } = await supabase.from("profiles").select("stripe_customer_id").eq("id", user.id).single();

	if (!profile?.stripe_customer_id) {
		throw new Error("No Stripe customer found");
	}

	const session = await stripe.billingPortal.sessions.create({
		customer: profile.stripe_customer_id,
		return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard/settings`,
	});

	return session.url;
}

export async function verifyCheckoutSession(sessionId: string) {
	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status === "paid" && session.status === "complete") {
			// Session is complete, check if subscription is active in database
			const supabase = await createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				return { success: false, error: "Not authenticated" };
			}

			const { data: profile } = await supabase.from("profiles").select("subscription_status, stripe_subscription_id").eq("id", user.id).single();

			// If webhook hasn't processed yet, wait a bit and check again
			if (!profile?.stripe_subscription_id || profile.subscription_status !== "active") {
				return { success: false, pending: true };
			}

			return { success: true };
		}

		return { success: false, error: "Payment not completed" };
	} catch (error) {
		console.error("[v0] Error verifying checkout session:", error);
		return { success: false, error: "Failed to verify session" };
	}
}
