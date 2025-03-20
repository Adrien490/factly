"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ThemeToggleButtonProps {
	variant?: "default" | "ghost" | "outline" | "secondary" | "link";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
	showLabel?: boolean;
	menuItem?: boolean;
}

export function ThemeToggleButton({
	variant = "outline",
	size = "icon",
	className,
	showLabel = false,
	menuItem = false,
}: ThemeToggleButtonProps) {
	const themeToggle = ThemeToggle();
	const ThemeIcon = themeToggle.icon;

	return (
		<Button
			variant={variant}
			size={size}
			onClick={themeToggle.onClick}
			className={cn(
				"relative overflow-hidden transition-all duration-300",
				menuItem ? "w-full justify-start" : "",
				className
			)}
			title={themeToggle.label}
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

			{showLabel && <span className="ml-2">{themeToggle.label}</span>}
		</Button>
	);
}
