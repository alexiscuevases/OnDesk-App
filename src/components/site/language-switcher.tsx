"use client";

import { useTransition } from "react";
import { Languages, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { platformConfigs } from "@/configs/platform";

const languages = [
	{ code: "en", label: "English", flag: "🇺🇸" },
	{ code: "es", label: "Español", flag: "🇪🇸" },
];

export function LanguageSwitcher() {
	const [isPending, startTransition] = useTransition();

	const getCurrentLocale = () => {
		if (typeof document === "undefined") return platformConfigs.defaultLanguage;
		const match = document.cookie.match(/locale=([^;]+)/);
		return match ? match[1] : platformConfigs.defaultLanguage;
	};

	async function setLocale(locale: string) {
		document.cookie = `locale=${locale}; path=/`;
		startTransition(() => window.location.reload());
	}

	const currentLanguage = languages.find((lang) => lang.code === getCurrentLocale());

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" disabled={isPending} className="gap-2" aria-label="Select language">
					<Languages className="h-4 w-4" />
					<span className="hidden sm:inline-block">{currentLanguage?.code.toUpperCase()}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				{languages.map((language) => (
					<DropdownMenuItem key={language.code} onClick={() => setLocale(language.code)} className="flex items-center justify-between cursor-pointer">
						<span className="flex items-center gap-2">
							<span>{language.flag}</span>
							<span>{language.label}</span>
						</span>
						{getCurrentLocale() === language.code && <Check className="h-4 w-4 text-primary" />}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
