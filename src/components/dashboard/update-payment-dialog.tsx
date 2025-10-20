"use client";

import type React from "react";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";

interface UpdatePaymentDialogProps {
	children: React.ReactNode;
}

export function UpdatePaymentDialog({ children }: UpdatePaymentDialogProps) {
	const [open, setOpen] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle payment update logic here
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[450px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Update Payment Method</DialogTitle>
						<DialogDescription>Enter your new card details below</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="card-number">Card Number</Label>
							<div className="relative">
								<Input id="card-number" placeholder="1234 5678 9012 3456" className="pl-10" />
								<CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="card-name">Cardholder Name</Label>
							<Input id="card-name" placeholder="John Doe" />
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="expiry">Expiry Date</Label>
								<Input id="expiry" placeholder="MM/YY" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="cvc">CVC</Label>
								<Input id="cvc" placeholder="123" maxLength={3} />
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="billing-zip">Billing ZIP Code</Label>
							<Input id="billing-zip" placeholder="12345" />
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button type="submit">Update Payment Method</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
