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
