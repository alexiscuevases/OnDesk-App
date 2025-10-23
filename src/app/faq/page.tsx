import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

const faqCategories = [
	{
		category: "Getting Started",
		questions: [
			{
				question: "What is AgentHub?",
				answer: "AgentHub is an AI-powered customer engagement platform that allows you to create, deploy, and manage intelligent AI agents that interact with your customers across multiple channels including WhatsApp, website chat widgets, and more. Our platform makes it easy to automate customer support, sales, and engagement without requiring technical expertise.",
			},
			{
				question: "How do I create my first AI agent?",
				answer: "Creating your first AI agent is simple! After signing up, navigate to the Agents section in your dashboard and click 'Create Agent'. You'll be guided through a step-by-step process where you can name your agent, define its purpose, customize its personality with prompts, and choose which AI model to use. Once created, you can immediately start testing and deploying it to your preferred channels.",
			},
			{
				question: "Do I need coding knowledge to use AgentHub?",
				answer: "No coding knowledge is required! AgentHub is designed to be user-friendly for everyone. Our intuitive interface allows you to create and customize AI agents using simple forms and prompts. However, if you're a developer, we also offer advanced features and API access for deeper customization.",
			},
			{
				question: "How long does it take to set up?",
				answer: "You can have your first AI agent up and running in less than 10 minutes. The basic setup involves creating an account, configuring your first agent with a prompt, and connecting it to a channel like your website or WhatsApp. More advanced configurations and integrations can be added as you grow.",
			},
		],
	},
	{
		category: "Features & Capabilities",
		questions: [
			{
				question: "What channels can I connect my AI agents to?",
				answer: "AgentHub supports multiple channels including WhatsApp Business, website chat widgets, SMS, and email. You can deploy the same agent across all channels or create specialized agents for different platforms. We're constantly adding new channel integrations based on customer feedback.",
			},
			{
				question: "Can I customize my AI agent's personality and responses?",
				answer: "You have full control over your agent's personality through custom prompts and system instructions. You can define the tone (professional, friendly, casual), set specific knowledge bases, create custom responses for common scenarios, and even train your agent on your company's specific data and policies.",
			},
			{
				question: "How many conversations can my agent handle simultaneously?",
				answer: "Your AI agents can handle unlimited simultaneous conversations. Unlike human agents who can only manage a few conversations at once, AI agents can engage with thousands of customers simultaneously without any degradation in response quality or speed.",
			},
			{
				question: "Does AgentHub support multiple languages?",
				answer: "Yes! Our AI agents support over 50 languages and can automatically detect and respond in the customer's preferred language. This makes it easy to provide global customer support without hiring multilingual staff.",
			},
		],
	},
	{
		category: "Pricing & Plans",
		questions: [
			{
				question: "What's included in the free trial?",
				answer: "Our free trial includes access to all Professional plan features for 14 days. You can create up to 3 AI agents, handle up to 1,000 conversations, connect to all available channels, and access our full analytics suite. No credit card is required to start your trial.",
			},
			{
				question: "Can I change my plan later?",
				answer: "Yes, you can upgrade or downgrade your plan at any time. When you upgrade, you'll immediately get access to the new features. When you downgrade, the changes will take effect at the end of your current billing cycle, and you'll retain access to premium features until then.",
			},
			{
				question: "What happens if I exceed my plan limits?",
				answer: "If you approach your plan limits, we'll send you notifications. If you exceed your conversation limit, your agents will continue working, but you'll be prompted to upgrade to a higher plan. We never abruptly stop your service—we want to ensure your customers always receive support.",
			},
			{
				question: "Do you offer discounts for annual billing?",
				answer: "Yes! Annual billing comes with a 20% discount compared to monthly billing. You'll also get priority support and early access to new features. Enterprise customers can contact our sales team for custom pricing and additional discounts.",
			},
		],
	},
	{
		category: "Security & Privacy",
		questions: [
			{
				question: "How secure is my data?",
				answer: "Security is our top priority. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We're SOC 2 Type II certified and fully GDPR compliant. Our infrastructure is hosted on enterprise-grade cloud providers with 99.9% uptime SLA. We conduct regular security audits and penetration testing.",
			},
			{
				question: "Who has access to my conversation data?",
				answer: "Only you and your authorized team members have access to your conversation data. AgentHub employees do not access your data unless you explicitly grant permission for support purposes. We never sell or share your data with third parties. You maintain full ownership of all your data.",
			},
			{
				question: "Can I export my data?",
				answer: "Yes, you can export all your data at any time in standard formats (CSV, JSON). This includes conversation histories, agent configurations, analytics data, and customer information. We believe in data portability and never lock you in.",
			},
			{
				question: "Are you GDPR and CCPA compliant?",
				answer: "Yes, we're fully compliant with GDPR, CCPA, and other major data protection regulations. We provide tools to help you manage customer data rights, including data deletion requests, data portability, and consent management. Our privacy policy clearly outlines how we handle data.",
			},
		],
	},
	{
		category: "Technical Support",
		questions: [
			{
				question: "What kind of support do you offer?",
				answer: "We offer multiple support channels: email support for all plans, live chat for Professional and Enterprise plans, and dedicated account managers for Enterprise customers. Our comprehensive documentation and video tutorials are available 24/7. Average response time is under 2 hours for Professional plans and under 30 minutes for Enterprise.",
			},
			{
				question: "Do you provide onboarding assistance?",
				answer: "Yes! All new customers get access to our onboarding resources including video tutorials, documentation, and email support. Professional plan customers get a personalized onboarding call. Enterprise customers receive dedicated onboarding with a customer success manager who helps with setup, training, and optimization.",
			},
			{
				question: "Can you help migrate from another platform?",
				answer: "Our team can help you migrate from other chatbot or customer service platforms. We provide migration guides, data import tools, and hands-on assistance for Enterprise customers. Contact our support team to discuss your specific migration needs.",
			},
			{
				question: "Do you have an API for custom integrations?",
				answer: "Yes, we offer a comprehensive REST API that allows you to integrate AgentHub with your existing systems. You can programmatically create agents, manage conversations, access analytics, and more. Full API documentation is available in your dashboard. API access is included in Professional and Enterprise plans.",
			},
		],
	},
];

export default function FAQPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader />
			<main className="flex-1">
				{/* Hero Section */}
				<section className="container py-16 md:py-24">
					<div className="mx-auto max-w-3xl text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
							Frequently Asked <span className="text-primary">Questions</span>
						</h1>
						<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
							Find answers to common questions about AgentHub, our features, pricing, and more.
						</p>
					</div>
				</section>

				{/* FAQ Sections */}
				<section className="container pb-16 md:pb-24">
					<div className="mx-auto max-w-4xl space-y-12">
						{faqCategories.map((category, categoryIndex) => (
							<div key={categoryIndex}>
								<h2 className="text-2xl font-bold mb-6">{category.category}</h2>
								<Accordion type="single" collapsible className="space-y-4">
									{category.questions.map((item, questionIndex) => (
										<AccordionItem
											key={questionIndex}
											value={`${categoryIndex}-${questionIndex}`}
											className="border rounded-lg px-6 bg-card">
											<AccordionTrigger className="text-left hover:no-underline py-4">
												<span className="font-semibold">{item.question}</span>
											</AccordionTrigger>
											<AccordionContent className="text-muted-foreground leading-relaxed pb-4">{item.answer}</AccordionContent>
										</AccordionItem>
									))}
								</Accordion>
							</div>
						))}
					</div>
				</section>

				{/* Contact CTA */}
				<section className="container pb-16 md:pb-24">
					<Card className="mx-auto max-w-4xl p-8 md:p-12 text-center">
						<CardContent>
							<h2 className="text-3xl font-bold mb-3">Still have questions?</h2>
							<p className="text-muted-foreground text-lg mb-6 leading-relaxed">
								Can't find the answer you're looking for? Our support team is here to help.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" asChild>
									<Link href="/contact">
										<Mail className="mr-2 h-4 w-4" />
										Contact Support
									</Link>
								</Button>
								<Button size="lg" variant="outline" asChild>
									<Link href="/dashboard">
										<MessageCircle className="mr-2 h-4 w-4" />
										Live Chat
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</section>
			</main>
			<SiteFooter />
		</div>
	);
}
