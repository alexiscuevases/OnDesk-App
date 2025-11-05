"use client";

import { Suspense } from "react";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { startCheckoutSession, verifyCheckoutSession } from "@/actions/stripe";
import { useSearchParams, useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { platformConfigs } from "@/configs/platform";
import { AppConfigs } from "@/configs/app";

const stripePromise = loadStripe(AppConfigs.stripe.publishableKey);

function SelectPlanContent() {
	const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
	const [isVerifying, setIsVerifying] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isAnnual, setIsAnnual] = useState(false);
	const searchParams = useSearchParams();
	const router = useRouter();
	const teamId = searchParams.get("team_id");

	useEffect(() => {
		if (!teamId) {
			setError("Team ID not found.");
			return;
		}

		const sessionId = searchParams.get("session_id");
		const errorParam = searchParams.get("error");

		if (errorParam === "payment_failed") {
			setError("Payment failed. Please try again.");
			return;
		}

		if (sessionId && !isVerifying) {
			setIsVerifying(true);

			// Poll for subscription activation (webhook might take a few seconds)
			const checkSubscription = async (attempts = 0) => {
				const result = await verifyCheckoutSession(sessionId, teamId);
				if (result.success) {
					// Subscription is active, redirect to dashboard
					router.push("/dashboard");
				} else if (result.pending && attempts < 10) {
					// Wait and try again (max 10 attempts = ~10 seconds)
					setTimeout(() => checkSubscription(attempts + 1), 1000);
				} else {
					// Failed after retries
					setIsVerifying(false);
					setError("Payment verification is taking longer than expected. Please refresh the page or contact support.");
				}
			};

			checkSubscription();
		}
	}, [searchParams, router, isVerifying, teamId]);

	const startCheckout = useCallback(async (): Promise<any> => {
		if (!selectedPlan || !teamId) return null;
		return await startCheckoutSession(selectedPlan, teamId);
	}, [selectedPlan, teamId]);

	const handleSelectPlan = (planId: string) => {
		setSelectedPlan(planId);
		setError(null);
	};

	if (isVerifying) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-6">
				<Card className="max-w-md w-full">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
							<Loader2 className="h-6 w-6 animate-spin text-primary" />
						</div>
						<CardTitle>Verifying your payment</CardTitle>
						<CardDescription>Please wait while we confirm your subscription. This will only take a few seconds.</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	if (selectedPlan && teamId) {
		return (
			<div className="min-h-screen bg-background p-6">
				<div className="mx-auto max-w-4xl">
					<div className="mb-8 text-center">
						<h1 className="text-3xl font-bold">Complete your subscription</h1>
						<p className="mt-2 text-muted-foreground">Enter your payment details to get started</p>
					</div>
					<Card className="pt-0">
						<CardContent>
							<EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret: startCheckout }}>
								<EmbeddedCheckout />
							</EmbeddedCheckoutProvider>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background p-6">
			<div className="mx-auto max-w-6xl">
				<div className="mb-12 text-center">
					<h1 className="text-4xl font-bold">Choose your plan</h1>
					<p className="mt-3 text-lg text-muted-foreground">Select the perfect plan for your business needs</p>
				</div>

				<div className="flex justify-center mb-8">
					<div className="flex items-center gap-4 bg-muted p-1 rounded-lg">
						<Button variant={!isAnnual ? "default" : "ghost"} size="sm" onClick={() => setIsAnnual(false)}>
							Monthly
						</Button>
						<Button variant={isAnnual ? "default" : "ghost"} size="sm" onClick={() => setIsAnnual(true)}>
							Annual <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-1 rounded">15% off</span>
						</Button>
					</div>
				</div>

				{error && (
					<Alert variant="destructive" className="mb-8">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<div className="grid gap-8 md:grid-cols-3">
					{platformConfigs.plans.map((product) => (
						<Card key={product.id} className={`relative ${product.popular ? "border-accent shadow-lg" : ""}`}>
							{product.popular && (
								<div className="absolute -top-4 left-1/2 -translate-x-1/2">
									<span className="rounded-full bg-accent px-4 py-1 text-sm font-medium text-accent-foreground">Most Popular</span>
								</div>
							)}
							<CardHeader>
								<CardTitle className="text-2xl">{product.name}</CardTitle>
								<CardDescription>{product.description}</CardDescription>
								<div className="mt-4">
									<span className="text-4xl font-bold">${isAnnual ? product.priceInCentsAnnual / 100 : product.priceInCents / 100}</span>
									<span className="text-muted-foreground">/{isAnnual ? "year" : "month"}</span>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<ul className="space-y-3">
									{product.features.map((feature, index) => (
										<li key={index} className="flex items-start gap-3">
											<Check className="h-5 w-5 shrink-0 text-primary" />
											<span className="text-sm">{feature}</span>
										</li>
									))}
								</ul>
								<Button
									className="w-full"
									variant={product.popular ? "default" : "outline"}
									onClick={() => handleSelectPlan(product.id)}
									disabled={!teamId}>
									Get Started
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}

export default function SelectPlanPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-background flex items-center justify-center p-6">
					<Loader2 className="h-8 w-8 animate-spin text-accent" />
				</div>
			}>
			<SelectPlanContent />
		</Suspense>
	);
}
