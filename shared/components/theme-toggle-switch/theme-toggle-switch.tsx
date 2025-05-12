"use client";

import { Switch } from "@/shared/components/ui/switch";
import { useTheme } from "@/shared/hooks";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function ThemeToggleSwitch() {
	const themeToggle = useTheme();
	const ThemeIcon = themeToggle.isDark ? Moon : Sun;

	return (
		<div className="flex items-center justify-between w-full px-2.5 py-2 hover:bg-accent/50 rounded-md transition-colors">
			<div className="flex items-center gap-2">
				<motion.div
					initial={{ rotate: 0 }}
					animate={{ rotate: themeToggle.isDark ? 180 : 0 }}
					transition={{ type: "spring", stiffness: 260, damping: 20 }}
				>
					<ThemeIcon className="size-4 text-muted-foreground" />
				</motion.div>
				<span className="text-sm font-medium">
					{themeToggle.isDark ? "Thème sombre" : "Thème clair"}
				</span>
			</div>
			<Switch
				checked={themeToggle.isDark}
				onCheckedChange={themeToggle.toggleTheme}
				className="ml-2 scale-90"
			/>
		</div>
	);
}
