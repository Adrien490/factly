import * as React from "react";

import { cn } from "@/features/shared/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					// Base styles - simples et efficaces
					"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",

					// Transitions douces
					"transition-colors duration-150",

					// États interactifs simplifiés
					"hover:border-ring/50",
					"focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring",

					// Placeholder élégant
					"placeholder:text-muted-foreground/70",

					// États spéciaux
					"disabled:cursor-not-allowed disabled:opacity-50",

					// Support de fichiers
					"file:border-0 file:bg-transparent file:text-sm file:font-medium",

					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);

Input.displayName = "Input";

export { Input };
