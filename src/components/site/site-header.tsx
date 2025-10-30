"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquareShare } from "lucide-react";
import { platformConfigs } from "@/configs/platform";
import { useAuth } from "../providers/auth-provider";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

export function SiteHeader() {
    const { profile } = useAuth();
    const t = useTranslations("Header");

	return (
		<header className="sticky top-0 z-50 w-full bg-card/70 backdrop-blur-md">
			<div className="container flex h-16 items-center justify-between">
				<div className="flex items-center gap-2">
					<Link href="/" className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
							<Bot className="h-5 w-5 text-primary-foreground" />
						</div>
						<span className="text-xl font-semibold">{platformConfigs.name}</span>
					</Link>
				</div>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        {t("features")}
                    </Link>
                    <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        {t("pricing")}
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        {t("about")}
                    </Link>
                    <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        {t("blog")}
                    </Link>
                </nav>

				<div className="flex items-center gap-3">
                    {profile ? (
						<>
							<Button variant="outline" asChild>
								<Link href="/dashboard">
                                    <span>{t("goDashboard")}</span>
									<MessageSquareShare />
								</Link>
							</Button>
						</>
					) : (
						<>
							<Button variant="ghost" asChild>
                                <Link href="/auth/sign-in">{t("signIn")}</Link>
							</Button>
							<Button asChild>
                                <Link href="/auth/sign-up">{t("getStarted")}</Link>
							</Button>
						</>
					)}
                    <LanguageSwitcher />
				</div>
			</div>
		</header>
	);
}
