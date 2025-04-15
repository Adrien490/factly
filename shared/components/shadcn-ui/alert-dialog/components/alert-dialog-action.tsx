"use client";

import * as React from "react";

import { cn } from "@/shared/utils";

import { buttonVariants } from "@/shared/components/shadcn-ui/button/constants";

const AlertDialogAction = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement> & {
		variant?: "default" | "destructive" | "outline";
	}
>(({ className, variant = "default", ...props }, ref) => (
	<button
		className={cn(buttonVariants({ variant }), className)}
		ref={ref}
		{...props}
	/>
));
AlertDialogAction.displayName = "AlertDialogAction";

export { AlertDialogAction };
