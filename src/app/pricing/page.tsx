import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PricingSection } from "@/components/pricing/pricing-section";
import { PricingFAQ } from "@/components/pricing/pricing-faq";

export default function PricingPage() {
	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader />
			<main className="flex-1">
				<PricingSection />
				<PricingFAQ />
			</main>
			<SiteFooter />
		</div>
	);
}
