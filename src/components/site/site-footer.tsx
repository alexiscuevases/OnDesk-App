import Link from "next/link";
import { Bot } from "lucide-react";

export function SiteFooter() {
	return (
		<footer className="bg-card shadow-xs">
			<div className="container py-12 md:py-16">
				<div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
					{/* Brand */}
					<div className="space-y-3">
						<Link href="/" className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
								<Bot className="h-5 w-5 text-primary-foreground" />
							</div>
							<span className="text-xl font-semibold">AgentHub</span>
						</Link>
						<p className="text-sm text-muted-foreground leading-relaxed">AI-powered customer engagement platform for modern businesses.</p>
					</div>

					{/* Product */}
					<div>
						<h3 className="mb-3 text-sm font-semibold">Product</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
									Features
								</Link>
							</li>
							<li>
								<Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
									Pricing
								</Link>
							</li>
							<li>
								<Link href="/roadmap" className="text-muted-foreground hover:text-foreground transition-colors">
									Roadmap
								</Link>
							</li>
							<li>
								<Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
									FAQ
								</Link>
							</li>
						</ul>
					</div>

					{/* Company */}
					<div>
						<h3 className="mb-3 text-sm font-semibold">Company</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
									About
								</Link>
							</li>
							<li>
								<Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
									Blog
								</Link>
							</li>
							<li>
								<Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
									Contact
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h3 className="mb-3 text-sm font-semibold">Legal</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/legal/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href="/legal/terms" className="text-muted-foreground hover:text-foreground transition-colors">
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
					<p>&copy; {new Date().getFullYear()} AgentHub. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
