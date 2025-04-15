"use client";

import { useTheme as useNextTheme } from "next-themes";

export interface UseTheme {
	isDark: boolean;
	toggleTheme: () => void;
}

export function useTheme(): UseTheme {
	const { setTheme, theme, systemTheme } = useNextTheme();

	const isDark =
		theme === "dark" || (theme === "system" && systemTheme === "dark");

	const toggleTheme = () => {
		setTheme(isDark ? "light" : "dark");
	};

	return {
		isDark,
		toggleTheme,
	};
}
