import { SiteHeader } from "@/modules/shared/components/site-header";
import { HeroSection } from "@/modules/shared/components/landing/hero-section";
import { FeaturesSection } from "@/modules/shared/components/landing/features-section";
import { CTASection } from "@/modules/shared/components/landing/cta-section";
import { SiteFooter } from "@/modules/shared/components/site-footer";

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

