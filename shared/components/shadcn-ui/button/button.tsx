import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/shared/utils";
import { buttonVariants } from "./constants";
import { ButtonProps } from "./types";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			radius,
			asChild = false,
			children,
			disabled,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : "button";

		return (
			<Comp
				className={cn(buttonVariants({ variant, size, radius, className }))}
				ref={ref}
				{...(!asChild && { disabled })}
				{...props}
			>
				{children}
			</Comp>
		);
	}
);

Button.displayName = "Button";

export { Button };
