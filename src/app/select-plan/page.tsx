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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function SelectPlanContent() {
	const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const searchParams = useSearchParams();
	const router = useRouter();
	const teamId = searchParams.get("team_id");

	useEffect(() => {
		// Verificar que tengamos el team_id
		if (!teamId) {
			setError("No se encontró el ID del equipo. Por favor, crea un equipo primero.");
			router.push("/create-team");
			return;
		}

		const sessionId = searchParams.get("session_id");
		const errorParam = searchParams.get("error");

		if (errorParam === "payment_failed") {
			setError("El pago falló. Por favor, intenta de nuevo.");
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
					setError("La verificación del pago está tomando más tiempo del esperado. Por favor, actualiza la página o contacta a soporte.");
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
		setIsLoading(true);
		setError(null);
	};

	if (isVerifying) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-6">
				<Card className="max-w-md w-full">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
							<Loader2 className="h-6 w-6 animate-spin text-accent" />
						</div>
						<CardTitle>Verificando tu pago</CardTitle>
						<CardDescription>Por favor espera mientras confirmamos tu suscripción. Esto solo tomará unos segundos.</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	if (selectedPlan && isLoading && teamId) {
		return (
			<div className="min-h-screen bg-background p-6">
				<div className="mx-auto max-w-4xl">
					<div className="mb-8 text-center">
						<h1 className="text-3xl font-bold">Completa tu suscripción</h1>
						<p className="mt-2 text-muted-foreground">Ingresa tus datos de pago para comenzar</p>
					</div>
					<EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret: startCheckout }}>
						<EmbeddedCheckout />
					</EmbeddedCheckoutProvider>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background p-6">
			<div className="mx-auto max-w-6xl">
				<div className="mb-12 text-center">
					<h1 className="text-4xl font-bold">Elige tu plan</h1>
					<p className="mt-3 text-lg text-muted-foreground">Selecciona el plan perfecto para las necesidades de tu negocio</p>
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
									<span className="rounded-full bg-accent px-4 py-1 text-sm font-medium text-accent-foreground">Más Popular</span>
								</div>
							)}
							<CardHeader>
								<CardTitle className="text-2xl">{product.name}</CardTitle>
								<CardDescription>{product.description}</CardDescription>
								<div className="mt-4">
									<span className="text-4xl font-bold">${product.priceInCents / 100}</span>
									<span className="text-muted-foreground">/mes</span>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<ul className="space-y-3">
									{product.features.map((feature, index) => (
										<li key={index} className="flex items-start gap-3">
											<Check className="h-5 w-5 shrink-0 text-accent" />
											<span className="text-sm">{feature}</span>
										</li>
									))}
								</ul>
								<Button
									className="w-full"
									variant={product.popular ? "default" : "outline"}
									onClick={() => handleSelectPlan(product.id)}
									disabled={!teamId}>
									Comenzar
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
