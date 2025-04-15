export const sizeClasses = {
	rings: {
		xs: "h-4 w-4",
		sm: "h-6 w-6",
		md: "h-8 w-8",
		lg: "h-10 w-10",
		xl: "h-12 w-12",
	},
	dots: {
		xs: "h-1 w-1",
		sm: "h-1.5 w-1.5",
		md: "h-2 w-2",
		lg: "h-2.5 w-2.5",
		xl: "h-3 w-3",
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
	ring: {
		initial: {
			rotate: 0,
			scale: 0.8,
			opacity: 0.6,
		},
		animate: {
			rotate: 360,
			scale: [0.8, 1, 0.8],
			opacity: [0.6, 1, 0.6],
			transition: {
				rotate: {
					duration: 1.2,
					repeat: Infinity,
					ease: "linear",
				},
				scale: {
					duration: 2,
					repeat: Infinity,
					ease: "easeInOut",
				},
				opacity: {
					duration: 2,
					repeat: Infinity,
					ease: "easeInOut",
				},
			},
		},
	},
	dot: {
		initial: {
			scale: 0.6,
			opacity: 0.5,
		},
		animate: {
			scale: [0.6, 1.2, 0.6],
			opacity: [0.5, 1, 0.5],
			transition: {
				duration: 2,
				repeat: Infinity,
				ease: "easeInOut",
			},
		},
	},
};
