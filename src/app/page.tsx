import { SiteHeader } from '@/modules/marketing/site-header';
import { HeroSection } from '@/modules/marketing/landing/hero-section';
import { FeaturesSection } from '@/modules/marketing/landing/features-section';
import { CTASection } from '@/modules/marketing/landing/cta-section';
import { SiteFooter } from '@/modules/marketing/site-footer';

export default function HomePage() {
	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader />
			<main className="flex-1">
				<HeroSection />
				<FeaturesSection />
				<CTASection />
			</main>
			<SiteFooter />
		</div>
	);
}
