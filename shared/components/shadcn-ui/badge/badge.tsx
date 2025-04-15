import { cn } from "@/shared/utils";
import { badgeVariants } from "./constants";
import { BadgeProps } from "./types";

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge };
