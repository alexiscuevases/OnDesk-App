import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, Target, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader />
			<main className="flex-1">
				{/* Hero Section */}
				<section className="container py-16 md:py-24">
					<div className="mx-auto max-w-3xl text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
							Building the Future of <span className="text-primary">Customer Engagement</span>
						</h1>
						<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
							AgentHub empowers businesses to create intelligent AI agents that provide exceptional customer experiences across every channel.
						</p>
					</div>
				</section>

				{/* Mission Section */}
				<section className="border-y border-border bg-muted/30 py-16 md:py-24">
					<div className="container">
						<div className="mx-auto max-w-3xl">
							<h2 className="text-3xl font-bold tracking-tight text-center mb-6">Our Mission</h2>
							<p className="text-lg text-muted-foreground leading-relaxed text-center">
								We believe every business deserves access to powerful AI technology that can transform how they engage with customers. Our
								mission is to democratize AI-powered customer service, making it accessible, affordable, and easy to implement for businesses of
								all sizes.
							</p>
						</div>
					</div>
				</section>

				{/* Values Section */}
				<section className="container py-16 md:py-24">
					<div className="mx-auto max-w-5xl">
						<h2 className="text-3xl font-bold tracking-tight text-center mb-12">Our Values</h2>
						<div className="grid gap-8 md:grid-cols-2">
							<Card className="p-6">
								<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
									<Target className="h-6 w-6 text-primary" />
								</div>
								<h3 className="text-xl font-semibold mb-3">Customer First</h3>
								<p className="text-muted-foreground leading-relaxed">
									Every decision we make is guided by what's best for our customers and their success.
								</p>
							</Card>

							<Card className="p-6">
								<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
									<Zap className="h-6 w-6 text-primary" />
								</div>
								<h3 className="text-xl font-semibold mb-3">Innovation</h3>
								<p className="text-muted-foreground leading-relaxed">
									We continuously push boundaries to deliver cutting-edge AI solutions that drive real results.
								</p>
							</Card>

							<Card className="p-6">
								<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
									<Users className="h-6 w-6 text-primary" />
								</div>
								<h3 className="text-xl font-semibold mb-3">Collaboration</h3>
								<p className="text-muted-foreground leading-relaxed">
									We believe in the power of teamwork and building strong partnerships with our clients.
								</p>
							</Card>

							<Card className="p-6">
								<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
									<Bot className="h-6 w-6 text-primary" />
								</div>
								<h3 className="text-xl font-semibold mb-3">Transparency</h3>
								<p className="text-muted-foreground leading-relaxed">
									We operate with honesty and openness in everything we do, from pricing to product development.
								</p>
							</Card>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="border-t border-border bg-muted/30 py-16 md:py-24">
					<div className="container">
						<div className="mx-auto max-w-3xl text-center">
							<h2 className="text-3xl font-bold tracking-tight mb-6">Ready to Get Started?</h2>
							<p className="text-lg text-muted-foreground mb-8 leading-relaxed">
								Join thousands of businesses already using AgentHub to transform their customer engagement.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" asChild>
									<Link href="/sign-up">Start Free Trial</Link>
								</Button>
								<Button size="lg" variant="outline" asChild>
									<Link href="/contact">Contact Sales</Link>
								</Button>
							</div>
						</div>
					</div>
				</section>
			</main>
			<SiteFooter />
		</div>
	);
}
