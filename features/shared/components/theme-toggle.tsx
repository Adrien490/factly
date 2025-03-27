"use client";

import { useTheme } from "next-themes";

export interface ThemeToggleResult {
	isDark: boolean;
	toggleTheme: () => void;
}

export function ThemeToggle(): ThemeToggleResult {
	const { setTheme, theme, systemTheme } = useTheme();

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
