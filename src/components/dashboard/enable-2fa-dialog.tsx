"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";

interface Enable2FADialogProps {
	children: React.ReactNode;
}

export function Enable2FADialog({ children }: Enable2FADialogProps) {
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState(1);
	const [copied, setCopied] = useState(false);

	const secretKey = "JBSWY3DPEHPK3PXP";
	const qrCodeUrl = "/2fa-qr-code.jpg";

	const handleCopy = () => {
		navigator.clipboard.writeText(secretKey);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle 2FA verification logic here
		setOpen(false);
		setStep(1);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[450px]">
				<DialogHeader>
					<DialogTitle>Enable Two-Factor Authentication</DialogTitle>
					<DialogDescription>{step === 1 ? "Scan the QR code with your authenticator app" : "Enter the verification code"}</DialogDescription>
				</DialogHeader>

				{step === 1 ? (
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">1. Download an authenticator app like Google Authenticator or Authy</p>
							<p className="text-sm text-muted-foreground">2. Scan this QR code with your app</p>
						</div>

						<Card>
							<CardContent className="flex items-center justify-center p-6">
								<img src={qrCodeUrl || "/placeholder.svg"} alt="2FA QR Code" className="h-48 w-48" />
							</CardContent>
						</Card>

						<div className="space-y-2">
							<Label>Or enter this code manually</Label>
							<div className="flex items-center gap-2">
								<Input value={secretKey} readOnly className="font-mono" />
								<Button type="button" variant="outline" size="icon" onClick={handleCopy}>
									{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
								</Button>
							</div>
						</div>
					</div>
				) : (
					<form onSubmit={handleSubmit}>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="verification-code">Verification Code</Label>
								<Input id="verification-code" placeholder="000000" maxLength={6} className="text-center text-2xl tracking-widest" />
								<p className="text-xs text-muted-foreground">Enter the 6-digit code from your authenticator app</p>
							</div>
						</div>

						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setStep(1)}>
								Back
							</Button>
							<Button type="submit">Verify & Enable</Button>
						</DialogFooter>
					</form>
				)}

				{step === 1 && (
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button onClick={() => setStep(2)}>Continue</Button>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}
