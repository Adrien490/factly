import { cva } from "class-variance-authority";

export const logoBackgroundVariants = cva(
	"absolute inset-0 transition-all duration-500",
	{
		variants: {
			variant: {
				default:
					"bg-linear-to-br from-primary via-primary/80 to-primary-foreground/70",
				accent:
					"bg-linear-to-br from-accent via-accent/80 to-accent-foreground/70",
				dark: "bg-linear-to-br from-foreground via-foreground/80 to-muted/70",
				light: "bg-linear-to-br from-background via-background/80 to-muted/70",
				gradient: "bg-linear-to-br from-primary via-indigo-500 to-violet-500",
				modern: "bg-linear-to-br from-primary/90 to-blue-600/80",
				minimal: "bg-linear-to-br from-foreground/10 to-foreground/5",
			},
			glow: {
				none: "opacity-0",
				sm: "opacity-60 blur-md",
				md: "opacity-70 blur-xl",
				lg: "opacity-75 blur-2xl",
				xl: "opacity-80 blur-3xl",
			},
			hover: {
				none: "",
				grow: "group-hover:opacity-90 group-hover:scale-110 transition-all duration-300",
				fade: "group-hover:opacity-100 transition-opacity duration-300",
				shift:
					"group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300",
			},
		},
		defaultVariants: {
			variant: "default",
			glow: "md",
			hover: "none",
		},
	}
);
