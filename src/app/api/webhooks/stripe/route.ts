import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

// Create Supabase admin client for webhook operations
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
});

export async function POST(req: Request) {
	const body = await req.text();
	const headersList = await headers();
	const signature = headersList.get("stripe-signature");

	if (!signature) {
		return NextResponse.json({ error: "No signature" }, { status: 400 });
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
	} catch (err) {
		console.error("[v0] Webhook signature verification failed:", err);
		return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
	}

	console.log("[v0] Webhook event received:", event.type);

	try {
		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object as Stripe.Checkout.Session;
				console.log("[v0] Checkout session completed:", session.id);

				// Get user ID from metadata
				const userId = session.metadata?.supabase_user_id;
				const planId = session.metadata?.plan_id;

				if (!userId || !planId) {
					console.error("[v0] Missing user ID or plan ID in session metadata");
					return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
				}

				// Get subscription details
				const subscriptionId = session.subscription as string;
				const subscription = await stripe.subscriptions.retrieve(subscriptionId);

				console.log("[v0] Updating profile for user:", userId);

				// Update user profile with subscription info
				const { error: profileError } = await supabaseAdmin
					.from("profiles")
					.update({
						stripe_customer_id: session.customer as string,
						stripe_subscription_id: subscriptionId,
						subscription_status: subscription.status,
						plan_id: planId,
						subscription_current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
						subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
					})
					.eq("id", userId);

				if (profileError) {
					console.error("[v0] Error updating profile:", profileError);
					throw profileError;
				}

				console.log("[v0] Profile updated successfully");
				break;
			}

			case "customer.subscription.updated": {
				const subscription = event.data.object as Stripe.Subscription;
				console.log("[v0] Subscription updated:", subscription.id);

				// Find user by subscription ID
				const { data: profile } = await supabaseAdmin.from("profiles").select("id").eq("stripe_subscription_id", subscription.id).single();

				if (profile) {
					const { error } = await supabaseAdmin
						.from("profiles")
						.update({
							subscription_status: subscription.status,
							subscription_current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
							subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
						})
						.eq("id", profile.id);

					if (error) {
						console.error("[v0] Error updating subscription:", error);
						throw error;
					}

					console.log("[v0] Subscription updated successfully");
				}
				break;
			}

			case "customer.subscription.deleted": {
				const subscription = event.data.object as Stripe.Subscription;
				console.log("[v0] Subscription deleted:", subscription.id);

				// Find user by subscription ID
				const { data: profile } = await supabaseAdmin.from("profiles").select("id").eq("stripe_subscription_id", subscription.id).single();

				if (profile) {
					const { error } = await supabaseAdmin
						.from("profiles")
						.update({
							subscription_status: "canceled",
							stripe_subscription_id: null,
						})
						.eq("id", profile.id);

					if (error) {
						console.error("[v0] Error canceling subscription:", error);
						throw error;
					}

					console.log("[v0] Subscription canceled successfully");
				}
				break;
			}

			default:
				console.log("[v0] Unhandled event type:", event.type);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("[v0] Webhook handler error:", error);
		return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
	}
}
