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

	if (!signature) return NextResponse.json({ error: "No signature" }, { status: 400 });

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

				// Get user ID and team ID from metadata
				const userId = session.metadata?.supabase_user_id;
				const teamId = session.metadata?.team_id;
				const planId = session.metadata?.plan_id;

				if (!userId || !teamId || !planId) {
					console.error("[v0] Missing user ID, team ID or plan ID in session metadata");
					return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
				}

				// Get subscription details
				const subscriptionId = session.subscription as string;
				const subscription = await stripe.subscriptions.retrieve(subscriptionId);

				console.log("[v0] Updating team for team:", teamId);

				// Update team with subscription info
				const { error: teamError } = await supabaseAdmin
					.from("teams")
					.update({
						stripe_subscription_id: subscriptionId,
						stripe_subscription_status: subscription.status,
						plan: planId,
					})
					.eq("id", teamId);

				if (teamError) {
					console.error("[v0] Error updating team:", teamError);
					throw teamError;
				}

				console.log("[v0] Team updated successfully");
				break;
			}

			case "customer.subscription.updated": {
				const subscription = event.data.object as Stripe.Subscription;
				console.log("[v0] Subscription updated:", subscription.id);

				// Find team by subscription ID
				const { data: team } = await supabaseAdmin.from("teams").select("id").eq("stripe_subscription_id", subscription.id).single();

				if (team) {
					const { error } = await supabaseAdmin
						.from("teams")
						.update({
							stripe_subscription_status: subscription.status,
						})
						.eq("id", team.id);

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

				// Find team by subscription ID
				const { data: team } = await supabaseAdmin.from("teams").select("id").eq("stripe_subscription_id", subscription.id).single();

				if (team) {
					const { error } = await supabaseAdmin
						.from("teams")
						.update({
							stripe_subscription_status: "canceled",
							stripe_subscription_id: null,
						})
						.eq("id", team.id);

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
