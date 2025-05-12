"use client";

import { Button } from "@/shared/components/ui/button";
import { useSidebar } from "@/shared/components/ui/sidebar";
import { Switch } from "@/shared/components/ui/switch";
import { useTheme } from "@/shared/hooks";
import { cn } from "@/shared/utils";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function ThemeToggleSwitch() {
	const themeToggle = useTheme();
	const { state } = useSidebar();
	const ThemeIcon = themeToggle.isDark ? Moon : Sun;

	return (
		<div
			className={cn(
				"flex items-center justify-between w-full px-2.5 py-2 rounded-md transition-colors",
				state === "collapsed" && "justify-center"
			)}
		>
			<div
				className={cn(
					"flex items-center gap-2",
					state === "collapsed" && "justify-center"
				)}
			>
				{state === "collapsed" ? (
					<Button
						variant="ghost"
						size="icon"
						onClick={themeToggle.toggleTheme}
						className="size-8"
					>
						<motion.div
							initial={{ rotate: 0 }}
							animate={{ rotate: themeToggle.isDark ? 180 : 0 }}
							transition={{ type: "spring", stiffness: 260, damping: 20 }}
						>
							<ThemeIcon className="size-4 text-muted-foreground" />
						</motion.div>
					</Button>
				) : (
					<motion.div
						initial={{ rotate: 0 }}
						animate={{ rotate: themeToggle.isDark ? 180 : 0 }}
						transition={{ type: "spring", stiffness: 260, damping: 20 }}
					>
						<ThemeIcon className="size-4 text-muted-foreground" />
					</motion.div>
				)}
				{state === "expanded" && (
					<span className="text-sm font-medium">
						{themeToggle.isDark ? "Thème sombre" : "Thème clair"}
					</span>
				)}
			</div>
			{state === "expanded" && (
				<Switch
					checked={themeToggle.isDark}
					onCheckedChange={themeToggle.toggleTheme}
					className="ml-2 scale-90"
				/>
			)}
		</div>
	);
}
