"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-50 w-full bg-card/70 backdrop-blur-md">
			<div className="container flex h-16 items-center justify-between">
				<div className="flex items-center gap-2">
					<Link href="/" className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
							<Bot className="h-5 w-5 text-primary-foreground" />
						</div>
						<span className="text-xl font-semibold">AgentHub</span>
					</Link>
				</div>

				<nav className="hidden md:flex items-center gap-6">
					<Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
						Features
					</Link>
					<Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
						Pricing
					</Link>
					<Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
						About
					</Link>
					<Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
						Blog
					</Link>
				</nav>

				<div className="flex items-center gap-3">
					<Button variant="ghost" asChild>
						<Link href="/auth/sign-in">Sign In</Link>
					</Button>
					<Button asChild>
						<Link href="/auth/sign-up">Get Started</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
