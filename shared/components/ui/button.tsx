import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium select-none transition-all duration-200 ease-out active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-2xs hover:bg-primary/90 hover:shadow-xs",
				destructive:
					"bg-destructive text-destructive-foreground shadow-2xs hover:bg-destructive/90 hover:shadow-xs",
				outline:
					"border border-input bg-background hover:bg-accent/40 hover:text-accent-foreground hover:border-accent",
				secondary:
					"bg-secondary text-secondary-foreground shadow-2xs hover:bg-secondary/80 hover:shadow-2xs",
				ghost: "hover:bg-accent/30 hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline decoration-primary/30 hover:decoration-primary/70",
				soft: "bg-primary/10 text-primary hover:bg-primary/20",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3 text-xs",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
				xl: "h-12 rounded-md px-10 text-base",
			},
			radius: {
				default: "rounded-md",
				full: "rounded-full",
				none: "rounded-none",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			radius: "default",
		},
		compoundVariants: [
			{
				variant: "default",
				size: "icon",
				className: "hover:bg-primary/90 active:bg-primary/95",
			},
			{
				variant: ["ghost", "outline"],
				className: "hover:shadow-none",
			},
		],
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			radius,
			asChild = false,
			isLoading,
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
				disabled={disabled || isLoading}
				{...props}
			>
				{isLoading ? (
					<>
						<span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70" />
						<span className="opacity-70">{children}</span>
					</>
				) : (
					children
				)}
			</Comp>
		);
	}
);

Button.displayName = "Button";

export { Button, buttonVariants };
