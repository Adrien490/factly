export const sizeClasses = {
	container: {
		xs: "h-1",
		sm: "h-1.5",
		md: "h-2",
		lg: "h-3",
		xl: "h-4",
	},
	text: {
		xs: "text-xs",
		sm: "text-sm",
		md: "text-sm",
		lg: "text-base",
		xl: "text-lg",
	},
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
	progress: {
		initial: {
			width: "0%",
			opacity: 0.7,
		},
		animate: {
			width: ["0%", "100%", "0%"],
			opacity: [0.7, 1, 0.7],
			transition: {
				duration: 2,
				repeat: Infinity,
				ease: "easeInOut",
			},
		},
	},
};
