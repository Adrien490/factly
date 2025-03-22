import { cva } from "class-variance-authority";

export const logoVariants = cva(
	"relative flex items-center justify-center transition-all duration-300",
	{
		variants: {
			variant: {
				default: "text-primary",
				accent: "text-accent-foreground",
				dark: "text-foreground",
				light: "text-background",
				gradient:
					"text-transparent bg-clip-text bg-linear-to-r from-primary to-indigo-500",
				modern: "text-primary hover:text-primary/90",
				minimal: "text-foreground hover:text-primary",
			},
			size: {
				xs: "w-6 h-6 min-w-6 min-h-6",
				sm: "w-8 h-8 min-w-8 min-h-8",
				md: "w-10 h-10 min-w-10 min-h-10",
				lg: "w-14 h-14 min-w-14 min-h-14",
				xl: "w-20 h-20 min-w-20 min-h-20",
			},
			shape: {
				square: "rounded-lg",
				softSquare: "rounded-xl",
				circle: "rounded-full",
				none: "",
				card: "rounded-xl shadow-md",
			},
			interactive: {
				true: "hover:scale-105 active:scale-95 cursor-pointer transition-transform",
				false: "",
			},
			elevation: {
				flat: "",
				raised: "shadow-2xs",
				elevated: "shadow-md",
				floating: "shadow-lg",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
			shape: "softSquare",
			interactive: false,
			elevation: "flat",
		},
	}
);

// Définition des variantes pour l'arrière-plan du logo avec des ratios standardisés
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
