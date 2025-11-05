import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignUpSuccessPage() {
	return (
		<div className="flex min-h-screen items-center justify-center p-6">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
						<Mail className="h-6 w-6 text-accent-foreground" />
					</div>
					<CardTitle className="text-2xl">Check your email</CardTitle>
					<CardDescription>We have sent you a confirmation link.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-muted-foreground text-center leading-relaxed">
						Please check your email and click on the confirmation link to activate your account. Once confirmed, you will be able to create your
						team and select your plan.
					</p>
					<Button asChild className="w-full">
						<Link href="/auth/sign-in">Go to Sign In</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
