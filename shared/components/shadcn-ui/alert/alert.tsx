import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/utils";
import { alertVariants } from "./constants";

const Alert = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
	<div
		ref={ref}
		role="alert"
		className={cn(alertVariants({ variant }), className)}
		{...props}
	/>
));
Alert.displayName = "Alert";

export { Alert };
