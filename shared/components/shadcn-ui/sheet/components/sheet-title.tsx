import { cn } from "@/shared/utils";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

const SheetTitle = React.forwardRef<
	React.ComponentRef<typeof SheetPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Title
		ref={ref}
		className={cn("text-lg font-semibold text-foreground", className)}
		{...props}
	/>
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

export { SheetTitle };
