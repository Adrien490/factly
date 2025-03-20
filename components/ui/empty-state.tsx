import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import React from "react";

// Définir les variants du composant avec class-variance-authority
const emptyStateVariants = cva(
	"flex flex-col items-center justify-center text-center w-full p-6",
	{
		variants: {
			variant: {
				default: "bg-background/60 border rounded-lg shadow-2xs",
				ghost: "bg-transparent",
				subtle: "bg-muted/40 rounded-lg",
			},
		},
		defaultVariants: {
			variant: "ghost",
		},
	}
);

export interface EmptyStateProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof emptyStateVariants> {
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: React.ReactNode;
	children?: React.ReactNode;
}

export function EmptyState({
	className,
	icon: Icon,
	title,
	description,
	action,
	variant,
	children,
	...props
}: EmptyStateProps) {
	return (
		<div className={cn(emptyStateVariants({ variant }), className)} {...props}>
			{Icon && (
				<div className="rounded-full bg-muted/50 p-3 mb-4">
					<Icon className="h-6 w-6 text-muted-foreground" />
				</div>
			)}

			<h3 className="text-lg font-medium text-foreground">{title}</h3>

			{description && (
				<p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
					{description}
				</p>
			)}

			{action && <div className="mt-4 w-full">{action}</div>}

			{children && <div className="mt-4 w-full">{children}</div>}
		</div>
	);
}
