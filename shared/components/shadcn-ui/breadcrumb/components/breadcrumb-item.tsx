import { cn } from "@/shared/utils";
import * as React from "react";

const BreadcrumbItem = React.forwardRef<
	HTMLLIElement,
	React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
	<li
		ref={ref}
		className={cn("inline-flex items-center gap-1.5", className)}
		{...props}
	/>
));
BreadcrumbItem.displayName = "BreadcrumbItem";

export { BreadcrumbItem };
