export const sizeClasses = {
	icons: {
		xs: "h-3 w-3",
		sm: "h-4 w-4",
		md: "h-5 w-5",
		lg: "h-6 w-6",
		xl: "h-8 w-8",
	},
	text: {
		xs: "text-xs",
		sm: "text-sm",
		md: "text-sm",
		lg: "text-base",
		xl: "text-lg",
	},
};

export const colorClass = {
	default: "text-muted-foreground",
	primary: "text-primary",
	secondary: "text-secondary",
	foreground: "text-foreground",
	muted: "text-muted",
	accent: "text-accent",
	success: "text-emerald-600 dark:text-emerald-500",
	warning: "text-amber-600 dark:text-amber-500",
	destructive: "text-destructive",
	white: "text-white",
};

// Animation presets pour framer-motion
export const loaderAnimations = {
	spinner: {
		initial: { rotate: 0, opacity: 0.8 },
		animate: {
			rotate: 360,
			opacity: 1,
			transition: {
				duration: 1,
				repeat: Infinity,
				ease: "linear",
			},
		},
	},
};
