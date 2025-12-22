import { SiteHeader } from '@/modules/marketing/site-header';
import { SiteFooter } from '@/modules/marketing/site-footer';
import { PricingSection } from '@/modules/marketing/pricing/pricing-section';
import { PricingFAQ } from '@/modules/marketing/pricing/pricing-faq';

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
