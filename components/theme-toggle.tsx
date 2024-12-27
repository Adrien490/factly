"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
	const { setTheme, theme } = useTheme();

	return {
		icon: theme === "dark" ? Moon : Sun,
		label: `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
		onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
	};
}
