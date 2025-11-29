import { SiteHeader } from "@/modules/shared/components/site-header";
import { SiteFooter } from "@/modules/shared/components/site-footer";
import { PricingSection } from "@/modules/shared/components/pricing/pricing-section";
import { PricingFAQ } from "@/modules/shared/components/pricing/pricing-faq";

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

