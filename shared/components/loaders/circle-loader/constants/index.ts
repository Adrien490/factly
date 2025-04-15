export const sizeClasses = {
	icons: {
		xs: "h-5 w-5",
		sm: "h-8 w-8",
		md: "h-10 w-10",
		lg: "h-12 w-12",
		xl: "h-16 w-16",
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
	circle: {
		initial: {
			pathLength: 0.25,
			pathOffset: 0,
			opacity: 0.5,
		},
		animate: {
			pathLength: 0.5,
			pathOffset: [0, 1],
			opacity: 1,
			transition: {
				pathOffset: {
					repeat: Infinity,
					duration: 1.5,
					ease: "linear",
				},
				pathLength: {
					duration: 0.5,
				},
				opacity: {
					duration: 0.25,
				},
			},
		},
	},
};
