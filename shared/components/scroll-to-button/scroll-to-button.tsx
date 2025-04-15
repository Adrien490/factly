"use client";

import { cn } from "@/shared/utils";
import { ChevronDown } from "lucide-react";
import { ScrollToButtonProps } from "./types";

export function ScrollToButton({
	targetId,
	label,
	className,
	iconClassName,
	behavior = "smooth",
	icon,
	...props
}: ScrollToButtonProps) {
	const handleClick = () => {
		document.getElementById(targetId)?.scrollIntoView({ behavior });
	};

	return (
		<button
			onClick={handleClick}
			className={cn(
				"flex flex-col items-center gap-2 text-muted-foreground/70 hover:text-muted-foreground transition-colors group",
				className
			)}
			{...props}
		>
			<span className="text-xs font-medium">{label}</span>
			<div className="relative h-6 w-4 flex items-center justify-center">
				{icon || (
					<ChevronDown
						className={cn("h-4 w-4 animate-bounce", iconClassName)}
					/>
				)}
			</div>
		</button>
	);
}
