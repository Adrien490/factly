export const sizeClasses = {
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
	dots: {
		container: {
			initial: { opacity: 0 },
			animate: {
				opacity: 1,
				transition: {
					staggerChildren: 0.15,
					delayChildren: 0.1,
				},
			},
		},
		item: {
			initial: { y: 0, opacity: 0.5 },
			animate: {
				y: [0, -10, 0],
				opacity: [0.5, 1, 0.5],
				transition: {
					duration: 0.8,
					repeat: Infinity,
					ease: "easeInOut",
				},
			},
		},
	},
};
