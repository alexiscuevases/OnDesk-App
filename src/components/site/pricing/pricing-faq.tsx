import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
	{
		question: "What's included in the free trial?",
		answer: "All plans come with a 14-day free trial that includes full access to all features in your chosen plan. No credit card required to start.",
	},
	{
		question: "Can I change plans later?",
		answer: "Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
	},
	{
		question: "What happens if I exceed my conversation limit?",
		answer: "We'll notify you when you're approaching your limit. You can either upgrade your plan or purchase additional conversation credits.",
	},
	{
		question: "Do you offer refunds?",
		answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with AgentHub, contact us for a full refund.",
	},
	{
		question: "Can I cancel my subscription anytime?",
		answer: "Absolutely. You can cancel your subscription at any time from your account settings. Your access will continue until the end of your billing period.",
	},
	{
		question: "What payment methods do you accept?",
		answer: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise customers can also pay via invoice.",
	},
];

export function PricingFAQ() {
	return (
		<section className="py-20 md:py-32 bg-muted/30">
			<div className="container">
				<div className="mx-auto max-w-3xl">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl mb-4">Frequently asked questions</h2>
						<p className="text-lg text-muted-foreground text-pretty leading-relaxed">Have a different question? Contact our support team.</p>
					</div>

					<Accordion type="single" collapsible className="w-full">
						{faqs.map((faq, index) => (
							<AccordionItem key={index} value={`item-${index}`}>
								<AccordionTrigger className="text-left text-base">{faq.question}</AccordionTrigger>
								<AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</section>
	);
}
