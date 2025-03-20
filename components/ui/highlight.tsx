import { cn } from "@/lib/utils";
import React from "react";

interface HighlightProps {
	children: React.ReactNode;
	className?: string;
}

export function Highlight({ children, className }: HighlightProps) {
	return (
		<span
			className={cn(
				"bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent inline-block",
				className
			)}
		>
			{children}
		</span>
	);
}
