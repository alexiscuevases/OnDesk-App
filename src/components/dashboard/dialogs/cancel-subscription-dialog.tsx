"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CancelSubscriptionDialogProps {
	children: React.ReactNode;
}

export function CancelSubscriptionDialog({ children }: CancelSubscriptionDialogProps) {
	const [open, setOpen] = useState(false);
	const [reason, setReason] = useState("");
	const [feedback, setFeedback] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle cancellation logic here
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Cancel Subscription</DialogTitle>
						<DialogDescription>We're sorry to see you go. Please tell us why you're canceling.</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<Alert>
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								Your subscription will remain active until November 20, 2025. After that, you'll lose access to all features.
							</AlertDescription>
						</Alert>

						<div className="space-y-3">
							<Label>Reason for canceling</Label>
							<RadioGroup value={reason} onValueChange={setReason}>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="expensive" id="expensive" />
									<Label htmlFor="expensive" className="font-normal cursor-pointer">
										Too expensive
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="features" id="features" />
									<Label htmlFor="features" className="font-normal cursor-pointer">
										Missing features I need
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="alternative" id="alternative" />
									<Label htmlFor="alternative" className="font-normal cursor-pointer">
										Switching to another service
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="not-using" id="not-using" />
									<Label htmlFor="not-using" className="font-normal cursor-pointer">
										Not using it enough
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="other" id="other" />
									<Label htmlFor="other" className="font-normal cursor-pointer">
										Other
									</Label>
								</div>
							</RadioGroup>
						</div>

						<div className="space-y-2">
							<Label htmlFor="feedback">Additional feedback (optional)</Label>
							<Textarea
								id="feedback"
								placeholder="Tell us more about your experience..."
								value={feedback}
								onChange={(e) => setFeedback(e.target.value)}
								className="min-h-[100px]"
							/>
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Keep Subscription
						</Button>
						<Button type="submit" variant="destructive">
							Cancel Subscription
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
