import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
if (!STRIPE_SECRET_KEY) throw new Error("Please define all Stripe environment variables");

export type StripeEvent = Stripe.Event;
export type StripeSubscription = Stripe.Subscription;
export type StripeCheckoutSession = Stripe.Checkout.Session;

export const stripe = new Stripe(STRIPE_SECRET_KEY);
