import { cn } from "@/shared/utils";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import React from "react";

const AvatarFallback = React.forwardRef<
	React.ComponentRef<typeof AvatarPrimitive.Fallback>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Fallback
		ref={ref}
		className={cn(
			"flex h-full w-full items-center justify-center rounded-full bg-muted",
			className
		)}
		{...props}
	/>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { AvatarFallback };
