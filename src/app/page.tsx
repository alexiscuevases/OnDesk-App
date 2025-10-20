import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { CTASection } from "@/components/landing/cta-section";
import { SiteFooter } from "@/components/site-footer";

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
