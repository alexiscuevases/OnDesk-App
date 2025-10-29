"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { platformConfigs } from "@/configs/platform";

interface ChangePlanDialogProps {
	children: React.ReactNode;
}

export function ChangePlanDialog({ children }: ChangePlanDialogProps) {
	const [open, setOpen] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState("professional");

	const handleSubmit = () => {
		// Handle plan change logic here
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[700px]">
				<DialogHeader>
					<DialogTitle>Change Plan</DialogTitle>
					<DialogDescription>Choose a plan that fits your needs</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4 md:grid-cols-3">
					{platformConfigs.plans.map((plan) => (
						<Card
							key={plan.id}
							className={`cursor-pointer transition-all ${selectedPlan === plan.id ? "ring-2 ring-primary" : "hover:border-primary/50"}`}
							onClick={() => setSelectedPlan(plan.id)}>
							<CardContent className="p-4 space-y-4">
								<div>
									<div className="flex items-center justify-between mb-2">
										<h3 className="font-semibold">{plan.name}</h3>
										{plan.popular && (
											<Badge variant="default" className="text-xs">
												Popular
											</Badge>
										)}
									</div>
									<p className="text-2xl font-bold">${plan.priceInCents / 100}</p>
									<p className="text-xs text-muted-foreground">per month</p>
								</div>

								<ul className="space-y-2">
									{plan.features.map((feature, index) => (
										<li key={index} className="flex items-start gap-2 text-sm">
											<Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
											<span>{feature}</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					))}
				</div>

				<DialogFooter>
					<Button type="button" variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleSubmit}>{selectedPlan === "professional" ? "Keep Current Plan" : "Change Plan"}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
