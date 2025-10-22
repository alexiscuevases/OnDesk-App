import { SiteHeader } from "@/components/site/site-header";
import { HeroSection } from "@/components/site/landing/hero-section";
import { FeaturesSection } from "@/components/site/landing/features-section";
import { CTASection } from "@/components/site/landing/cta-section";
import { SiteFooter } from "@/components/site/site-footer";

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
