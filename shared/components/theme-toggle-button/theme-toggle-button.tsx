"use client";

import { Button } from "@/shared/components";
import { useTheme } from "@/shared/hooks";
import { cn } from "@/shared/utils";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { ThemeToggleButtonProps } from "./types";

export function ThemeToggleButton({
	variant = "ghost",
	size = "icon",
	className,
	showLabel = false,
	menuItem = false,
}: ThemeToggleButtonProps) {
	const themeToggle = useTheme();
	const ThemeIcon = themeToggle.isDark ? Moon : Sun;

	return (
		<Button
			variant={variant}
			size={size}
			onClick={themeToggle.toggleTheme}
			className={cn(
				"relative overflow-hidden transition-all duration-300",
				menuItem ? "w-full justify-start" : "",
				className
			)}
			title={themeToggle.isDark ? "Thème sombre" : "Thème clair"}
		>
			<motion.div
				initial={{ rotate: 0 }}
				animate={{ rotate: themeToggle.isDark ? 180 : 0 }}
				transition={{ type: "spring", stiffness: 260, damping: 20 }}
				className="flex items-center justify-center"
			>
				<ThemeIcon className={cn("size-4", menuItem ? "mr-2" : "")} />
			</motion.div>

			{/* Effet de lumière qui suit le changement de thème */}
			<div className="absolute inset-0 pointer-events-none">
				<div
					className={cn(
						"absolute inset-0 rounded-md transition-opacity duration-500",
						themeToggle.isDark
							? "bg-primary/5 opacity-0"
							: "bg-primary/10 opacity-0"
					)}
				/>
			</div>

			{showLabel && (
				<span className="ml-2">
					{themeToggle.isDark ? "Thème sombre" : "Thème clair"}
				</span>
			)}
		</Button>
	);
}
