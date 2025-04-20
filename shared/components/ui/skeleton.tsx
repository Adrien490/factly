import { cn } from "@/shared/utils";
import * as React from "react";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			aria-hidden="true"
			className={cn(
				"bg-muted/70 relative overflow-hidden rounded-md animate-pulse before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
				className
			)}
			{...props}
		/>
	);
}

export { Skeleton };
