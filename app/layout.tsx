import { Toaster } from "@/shared/components/shadcn-ui/toaster";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { connection } from "next/server";
import { Suspense } from "react";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

async function UTSSR() {
	await connection();
	return <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />;
}

export const metadata: Metadata = {
	title: "Factly",
	description: "Votre gestion commerciale en ligne",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Toaster />
					<Suspense>
						<UTSSR />
					</Suspense>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
