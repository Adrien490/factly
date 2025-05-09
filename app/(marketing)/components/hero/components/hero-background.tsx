"use client";

import { BackgroundLines } from "@/shared/components/ui/background-lines";
import { useTheme } from "next-themes";

interface HeroBackgroundProps {
	children: React.ReactNode;
}

export function HeroBackground({ children }: HeroBackgroundProps) {
	const theme = useTheme();
	if (theme.theme === "dark") {
		return <BackgroundLines>{children}</BackgroundLines>;
	} else {
		return <>{children}</>;
	}
}
