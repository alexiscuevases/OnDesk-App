"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AppConfigs } from "@/configs/app";
import { platformConfigs } from "@/configs/platform";
import { Check } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
	const [isAnnual, setIsAnnual] = useState(false);

	return (
		<section className="py-20 md:py-32">
			<div className="container">
				{/* Header */}
				<div className="mx-auto max-w-2xl text-center mb-16">
					<h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl mb-4">Simple, transparent pricing</h1>
					<p className="text-lg text-muted-foreground text-pretty leading-relaxed">
						Choose the perfect plan for your business. All plans include a 14-day free trial.
					</p>
				</div>

				<div className="flex justify-center mb-12">
					<div className="flex items-center gap-4 bg-muted p-1 rounded-lg">
						<Button variant={!isAnnual ? "default" : "ghost"} size="sm" onClick={() => setIsAnnual(false)}>
							Monthly
						</Button>
						<Button variant={isAnnual ? "default" : "ghost"} size="sm" onClick={() => setIsAnnual(true)}>
							Annual <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-1 rounded">Save 15%</span>
						</Button>
					</div>
				</div>

				{/* Pricing Cards */}
				<div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
					{platformConfigs.plans.map((plan, index) => (
						<Card key={index} className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg scale-105" : "border-border"}`}>
							{plan.popular && (
								<div className="absolute -top-4 left-1/2 -translate-x-1/2">
									<span className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
										Most Popular
									</span>
								</div>
							)}

							<CardHeader className="pb-8">
								<CardTitle className="text-2xl">{plan.name}</CardTitle>
								<CardDescription className="text-base leading-relaxed">{plan.description}</CardDescription>
								<div className="mt-4">
									<span className="text-4xl font-bold">${isAnnual ? plan.priceInCentsAnnual / 100 : plan.priceInCents / 100}</span>
									<span className="text-muted-foreground">/{isAnnual ? "year" : "month"}</span>
								</div>
							</CardHeader>

							<CardContent className="flex-1">
								<ul className="space-y-3">
									{plan.features.map((feature, featureIndex) => (
										<li key={featureIndex} className="flex items-start gap-3">
											<Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
											<span className="text-sm leading-relaxed">{feature}</span>
										</li>
									))}
								</ul>
							</CardContent>

							<CardFooter>
								<Button className="w-full" variant={plan.popular ? "default" : "outline"} size="lg" asChild>
									<Link href={`${AppConfigs.url}/auth/sign-up?plan_id=${plan.id}`}>Start Free Trial</Link>
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>

				{/* Additional info */}
				<div className="mt-16 text-center">
					<p className="text-sm text-muted-foreground">All plans include SSL encryption, 99.9% uptime SLA, and GDPR compliance.</p>
				</div>
			</div>
		</section>
	);
}
