import { SignInForm } from "@/components/site/forms/sign-in-form";
import { platformConfigs } from "@/configs/platform";
import { Bot } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
	return (
		<div className="flex min-h-screen">
			{/* Left side - Form */}
			<div className="flex bg-card flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
				<div className="mx-auto w-full max-w-sm">
					<div className="mb-8">
						<Link href="/" className="flex items-center gap-2 mb-6">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
								<Bot className="h-5 w-5 text-primary-foreground" />
							</div>
							<span className="text-xl font-semibold">{platformConfigs.name}</span>
						</Link>
						<h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
						<p className="mt-2 text-sm text-muted-foreground">Sign in to your account to continue</p>
					</div>

					<SignInForm />

					<p className="mt-6 text-center text-sm text-muted-foreground">
						Don't have an account?{" "}
						<Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
							Sign up
						</Link>
					</p>
				</div>
			</div>

			{/* Right side - Image/Branding */}
			<div className="hidden lg:block lg:flex-1 relative">
				<div className="absolute inset-0 from-accent/20 via-background to-background" />
				<div className="relative flex h-full items-center justify-center p-12">
					<div className="max-w-md space-y-6 text-center">
						<h2 className="text-4xl font-bold text-balance">Automate customer engagement with AI</h2>
						<p className="text-lg text-muted-foreground text-pretty leading-relaxed">
							Join thousands of businesses using {platformConfigs.name} to provide 24/7 customer support through AI-powered agents.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
