import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/features/shared/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium select-none transition-all duration-300 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md hover:translate-y-[-1px]",
				destructive:
					"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md hover:translate-y-[-1px]",
				outline:
					"border border-input bg-background/40 backdrop-blur-sm hover:bg-accent/40 hover:text-accent-foreground hover:border-accent hover:shadow-sm",
				secondary:
					"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md hover:translate-y-[-1px]",
				ghost: "hover:bg-accent/30 hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline decoration-primary/30 hover:decoration-primary/70",
				soft: "bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-sm",
				gradient:
					"bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-md hover:opacity-90",
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
				lg: "rounded-lg",
				xl: "rounded-xl",
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
			{
				variant: ["default", "destructive", "secondary"],
				className:
					"before:absolute before:inset-0 before:h-full before:w-full before:rounded-inherit before:bg-white/5 before:opacity-0 hover:before:opacity-100 relative overflow-hidden",
			},
		],
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

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
				disabled={disabled}
				{...props}
			>
				{children}
			</Comp>
		);
	}
);

Button.displayName = "Button";

export { Button, buttonVariants };
