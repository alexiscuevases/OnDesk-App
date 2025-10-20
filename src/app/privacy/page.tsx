import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function PrivacyPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader />
			<main className="flex-1">
				<div className="container max-w-4xl py-16">
					<h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
					<div className="prose prose-neutral dark:prose-invert max-w-none">
						<p className="text-lg text-muted-foreground mb-8">Last updated: January 2025</p>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
							<p className="text-muted-foreground leading-relaxed mb-4">We collect information that you provide directly to us, including:</p>
							<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
								<li>Account information (name, email address, password)</li>
								<li>Profile information (company name, role, preferences)</li>
								<li>Payment information (processed securely through our payment providers)</li>
								<li>Customer conversation data processed through your AI agents</li>
								<li>Usage data and analytics about how you use our services</li>
							</ul>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
							<p className="text-muted-foreground leading-relaxed mb-4">We use the information we collect to:</p>
							<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
								<li>Provide, maintain, and improve our services</li>
								<li>Process transactions and send related information</li>
								<li>Send technical notices, updates, and support messages</li>
								<li>Respond to your comments and questions</li>
								<li>Monitor and analyze trends, usage, and activities</li>
								<li>Detect, prevent, and address technical issues and security threats</li>
							</ul>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">3. Data Storage and Security</h2>
							<p className="text-muted-foreground leading-relaxed">
								We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful
								processing, accidental loss, destruction, or damage. All data is encrypted in transit and at rest. We use industry-standard
								security protocols and regularly update our security measures.
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
							<p className="text-muted-foreground leading-relaxed mb-4">
								We do not sell your personal data. We may share your information only in the following circumstances:
							</p>
							<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
								<li>With your consent or at your direction</li>
								<li>With service providers who perform services on our behalf</li>
								<li>To comply with legal obligations</li>
								<li>To protect the rights and safety of AgentHub and our users</li>
								<li>In connection with a merger, acquisition, or sale of assets</li>
							</ul>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">5. Your Rights and Choices</h2>
							<p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
							<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
								<li>Access and receive a copy of your personal data</li>
								<li>Correct inaccurate or incomplete personal data</li>
								<li>Request deletion of your personal data</li>
								<li>Object to or restrict processing of your personal data</li>
								<li>Export your data in a portable format</li>
								<li>Withdraw consent at any time</li>
							</ul>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
							<p className="text-muted-foreground leading-relaxed">
								We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies
								through your browser settings. However, disabling cookies may limit your ability to use certain features of our services.
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">7. International Data Transfers</h2>
							<p className="text-muted-foreground leading-relaxed">
								Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate
								safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
							<p className="text-muted-foreground leading-relaxed">
								Our services are not directed to children under 16. We do not knowingly collect personal information from children under 16. If
								you become aware that a child has provided us with personal data, please contact us.
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
							<p className="text-muted-foreground leading-relaxed">
								We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this
								page and updating the "Last updated" date.
							</p>
						</section>

						<section className="mb-8">
							<h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
							<p className="text-muted-foreground leading-relaxed">
								If you have any questions about this Privacy Policy, please contact us at privacy@agenthub.com or write to us at our mailing
								address.
							</p>
						</section>
					</div>
				</div>
			</main>
			<SiteFooter />
		</div>
	);
}
