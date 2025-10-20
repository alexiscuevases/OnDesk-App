"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download } from "lucide-react";
import { ChangePlanDialog } from "../change-plan-dialog";
import { CancelSubscriptionDialog } from "../cancel-subscription-dialog";
import { UpdatePaymentDialog } from "../update-payment-dialog";

export function BillingSettings() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Current Plan</CardTitle>
					<CardDescription>Manage your subscription and billing</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">Professional Plan</p>
							<p className="text-sm text-muted-foreground">$99/month</p>
						</div>
						<Badge>Active</Badge>
					</div>

					<div className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Billing cycle</span>
							<span>Monthly</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Next billing date</span>
							<span>November 20, 2025</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Conversations used</span>
							<span>8,429 / 10,000</span>
						</div>
					</div>

					<div className="flex gap-2">
						<ChangePlanDialog>
							<Button variant="outline">Change Plan</Button>
						</ChangePlanDialog>
						<CancelSubscriptionDialog>
							<Button variant="outline">Cancel Subscription</Button>
						</CancelSubscriptionDialog>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Payment Method</CardTitle>
					<CardDescription>Manage your payment information</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center gap-3 p-4 border border-border rounded-lg">
						<CreditCard className="h-5 w-5 text-muted-foreground" />
						<div className="flex-1">
							<p className="font-medium">•••• •••• •••• 4242</p>
							<p className="text-sm text-muted-foreground">Expires 12/2026</p>
						</div>
						<Badge variant="outline">Default</Badge>
					</div>

					<UpdatePaymentDialog>
						<Button variant="outline">Update Payment Method</Button>
					</UpdatePaymentDialog>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Billing History</CardTitle>
					<CardDescription>Download your past invoices</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{[
							{ date: "Oct 20, 2025", amount: "$99.00", status: "Paid" },
							{ date: "Sep 20, 2025", amount: "$99.00", status: "Paid" },
							{ date: "Aug 20, 2025", amount: "$99.00", status: "Paid" },
						].map((invoice, index) => (
							<div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
								<div>
									<p className="font-medium">{invoice.date}</p>
									<p className="text-sm text-muted-foreground">{invoice.amount}</p>
								</div>
								<div className="flex items-center gap-3">
									<Badge variant="outline">{invoice.status}</Badge>
									<Button variant="ghost" size="icon">
										<Download className="h-4 w-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
