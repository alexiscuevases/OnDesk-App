import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { platformConfigs } from "@/configs/platform";
import { NextIntlClientProvider } from "next-intl";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: `${platformConfigs.name} | AI-Powered Customer Engagement Platform`,
	description: "Create specialized AI agents that engage with your customers 24/7 through WhatsApp and website chat.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<NextIntlClientProvider>
					<ThemeProvider attribute="class" defaultTheme="ligth" enableSystem disableTransitionOnChange>
						<QueryProvider>
							<AuthProvider>{children}</AuthProvider>
						</QueryProvider>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
