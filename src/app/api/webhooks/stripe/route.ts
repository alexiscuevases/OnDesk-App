import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe, StripeCheckoutSession, StripeEvent, StripeSubscription } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
if (!STRIPE_WEBHOOK_SECRET || !STRIPE_WEBHOOK_SECRET) throw new Error("Please define all Stripe environment variables");

export async function POST(req: Request) {
	const body = await req.text();
	const headersList = await headers();

	const signature = headersList.get("stripe-signature");
	if (!signature) return NextResponse.json({ error: "No signature" }, { status: 400 });

	let event: StripeEvent;
	try {
		event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
	} catch (err: unknown) {
		return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
	}

	console.log("[Stripe] Webhook event received:", event.type);

	try {
		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object as StripeCheckoutSession;
				console.log("[v0] Checkout session completed:", session.id);

				// Get user ID and team ID from metadata
				const userId = session.metadata?.supabase_user_id;
				const teamId = session.metadata?.team_id;
				const planId = session.metadata?.plan_id;

				if (!userId || !teamId || !planId) {
					console.error("[Stripe] Missing user ID, team ID or plan ID in session metadata");
					return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
				}

				// Get subscription details
				const subscriptionId = session.subscription as string;
				const subscription = await stripe.subscriptions.retrieve(subscriptionId);

				console.log("[Stripe] Updating team for team:", teamId);

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
					console.error("[Stripe] Error updating team:", teamError);
					throw teamError;
				}

				console.log("[Stripe] Team updated successfully");
				break;
			}

			case "customer.subscription.updated": {
				const subscription = event.data.object as StripeSubscription;
				console.log("[Stripe] Subscription updated:", subscription.id);

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
						console.error("[Stripe] Error updating subscription:", error);
						throw error;
					}

					console.log("[Stripe] Subscription updated successfully");
				}
				break;
			}

			case "customer.subscription.deleted": {
				const subscription = event.data.object as StripeSubscription;
				console.log("[Stripe] Subscription deleted:", subscription.id);

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
						console.error("[Stripe] Error canceling subscription:", error);
						throw error;
					}

					console.log("[Stripe] Subscription canceled successfully");
				}
				break;
			}

			default:
				console.log("[Stripe] Unhandled event type:", event.type);
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("[Stripe] Webhook handler error:", error);
		return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
	}
}
