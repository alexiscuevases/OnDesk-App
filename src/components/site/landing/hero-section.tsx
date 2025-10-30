import { Button } from "@/components/ui/button";
import { platformConfigs } from "@/configs/platform";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function HeroSection() {
    const t = useTranslations("Hero");
    return (
		<section className="relative py-20 md:py-32 overflow-hidden">
			{/* Background gradient effect */}
			<div className="absolute inset-0 -z-10 from-accent/20 via-background to-background" />

			<div className="container">
				<div className="mx-auto max-w-4xl text-center">
					{/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-foreground bg-accent px-4 py-1.5 text-sm">
						<Sparkles className="h-4 w-4 text-accent-foreground" />
                        <span className="text-accent-foreground">{t("badge")}</span>
					</div>

					{/* Heading */}
                    <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">{t("title")}</h1>

					{/* Description */}
                    <p className="mb-10 text-lg text-muted-foreground text-pretty leading-relaxed md:text-xl max-w-3xl mx-auto">{t("description")}</p>

					{/* CTA Buttons */}
					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button size="lg" className="gap-2 text-base" asChild>
                            <Link href="/auth/sign-up">
                                {t("startTrial")}
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </Button>
						<Button size="lg" variant="outline" className="text-base bg-transparent" asChild>
                            <Link href="/pricing">{t("viewPricing")}</Link>
						</Button>
					</div>

					{/* Social proof */}
                    <p className="mt-8 text-sm text-muted-foreground">{t("socialProof")}</p>
				</div>

				{/* Hero image placeholder */}
				<div className="mt-16 mx-auto max-w-5xl">
                    <img src="/modern-ai-chatbot-dashboard-interface-with-dark-th.jpg" alt={t("altDashboard", { name: platformConfigs.name })} className="rounded-4xl shadow-2xl w-full" />
				</div>
			</div>
		</section>
	);
}
