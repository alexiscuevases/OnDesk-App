import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
	return (
		<section className="py-20 md:py-32">
			<div className="container">
				<div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center md:p-12">
					<h2 className="mb-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
						Ready to transform your customer engagement?
					</h2>
					<p className="mb-8 text-lg text-muted-foreground text-pretty leading-relaxed">
						Join thousands of businesses using AI agents to automate support, increase conversions, and delight customers.
					</p>
					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button size="lg" className="gap-2" asChild>
							<Link href="/auth/sign-up">
								Start Free Trial
								<ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<Link href="/pricing">View Pricing</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
