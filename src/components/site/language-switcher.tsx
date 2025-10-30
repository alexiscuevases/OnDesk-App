"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
	const [isPending, startTransition] = useTransition();

	function setLocale(locale: string) {
		document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
		startTransition(() => {
			window.location.reload();
		});
	}

	return (
		<div className="flex items-center gap-1">
			<Button variant="ghost" size="sm" disabled={isPending} onClick={() => setLocale("en")} aria-label="Switch to English">
				EN
			</Button>
			<Button variant="ghost" size="sm" disabled={isPending} onClick={() => setLocale("es")} aria-label="Cambiar a Español">
				ES
			</Button>
		</div>
	);
}
