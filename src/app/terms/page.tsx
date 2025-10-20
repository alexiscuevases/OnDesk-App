import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function TermsPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader />
			<main className="flex-1">
				<div className="container max-w-4xl py-16">
					<h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
					<div className="prose prose-neutral dark:prose-invert max-w-none">
						<p className="text-lg text-muted-foreground mb-8">Last updated: January 2025</p>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
							<p className="text-muted-foreground leading-relaxed">
								By accessing and using AgentHub's services, you accept and agree to be bound by the terms and provision of this agreement. If
								you do not agree to abide by the above, please do not use this service.
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
							<p className="text-muted-foreground leading-relaxed mb-4">
								Permission is granted to temporarily access and use AgentHub's services for personal or commercial purposes. This is the grant
								of a license, not a transfer of title, and under this license you may not:
							</p>
							<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
								<li>Modify or copy the materials</li>
								<li>Use the materials for any commercial purpose without proper licensing</li>
								<li>Attempt to decompile or reverse engineer any software contained on AgentHub</li>
								<li>Remove any copyright or other proprietary notations from the materials</li>
								<li>Transfer the materials to another person or "mirror" the materials on any other server</li>
							</ul>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">3. Service Description</h2>
							<p className="text-muted-foreground leading-relaxed">
								AgentHub provides AI-powered customer engagement tools that allow businesses to create, deploy, and manage AI agents for
								customer interactions across multiple channels including WhatsApp, website chat widgets, and other messaging platforms.
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
							<p className="text-muted-foreground leading-relaxed">
								You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all
								activities that occur under your account or password. AgentHub reserves the right to refuse service, terminate accounts, or
								remove content at our sole discretion.
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">5. Privacy and Data Protection</h2>
							<p className="text-muted-foreground leading-relaxed">
								Your use of AgentHub is also governed by our Privacy Policy. We take data protection seriously and comply with applicable data
								protection laws. All customer conversation data is encrypted and stored securely.
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
							<p className="text-muted-foreground leading-relaxed">
								Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law. We
								reserve the right to change our pricing with 30 days notice to existing customers.
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">7. Limitations</h2>
							<p className="text-muted-foreground leading-relaxed">
								In no event shall AgentHub or its suppliers be liable for any damages (including, without limitation, damages for loss of data
								or profit, or due to business interruption) arising out of the use or inability to use AgentHub's services.
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">8. Modifications</h2>
							<p className="text-muted-foreground leading-relaxed">
								AgentHub may revise these terms of service at any time without notice. By using this service you are agreeing to be bound by the
								then current version of these terms of service.
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
							<p className="text-muted-foreground leading-relaxed">
								If you have any questions about these Terms, please contact us at legal@agenthub.com
							</p>
						</section>
					</div>
				</div>
			</main>
			<SiteFooter />
		</div>
	);
}
