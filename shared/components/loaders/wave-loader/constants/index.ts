export const sizeClasses = {
	bars: {
		xs: "h-1 w-1",
		sm: "h-2 w-1",
		md: "h-3 w-1.5",
		lg: "h-4 w-2",
		xl: "h-5 w-2.5",
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
	wave: {
		container: {
			initial: { opacity: 0 },
			animate: {
				opacity: 1,
				transition: {
					staggerChildren: 0.1,
					delayChildren: 0.1,
				},
			},
		},
		item: {
			initial: { y: 0, opacity: 0.5 },
			animate: (i: number) => ({
				y: [0, -12, 0],
				opacity: [0.5, 1, 0.5],
				transition: {
					duration: 0.8,
					repeat: Infinity,
					ease: "easeInOut",
					delay: i * 0.1,
				},
			}),
		},
	},
};
