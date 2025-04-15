export const sizeClasses = {
	icons: {
		xs: "h-3 w-3",
		sm: "h-4 w-4",
		md: "h-5 w-5",
		lg: "h-6 w-6",
		xl: "h-8 w-8",
	},
	dots: {
		xs: "h-1.5 w-1.5",
		sm: "h-2 w-2",
		md: "h-2.5 w-2.5",
		lg: "h-3 w-3",
		xl: "h-4 w-4",
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

export const bgColorClass = {
	default: "bg-muted-foreground",
	primary: "bg-primary",
	secondary: "bg-secondary",
	foreground: "bg-foreground",
	muted: "bg-muted",
	accent: "bg-accent",
	success: "bg-emerald-600 dark:bg-emerald-500",
	warning: "bg-amber-600 dark:bg-amber-500",
	destructive: "bg-destructive",
	white: "bg-white",
};

// Animation presets pour framer-motion
export const loaderAnimations = {
	pulse: {
		initial: { scale: 0.8, opacity: 0.5 },
		animate: {
			scale: [0.8, 1.2, 0.8],
			opacity: [0.5, 1, 0.5],
			transition: {
				duration: 1.5,
				repeat: Infinity,
				ease: "easeInOut",
			},
		},
	},
};
