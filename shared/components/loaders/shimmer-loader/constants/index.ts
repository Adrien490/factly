export const sizeClasses = {
	containers: {
		xs: "h-1",
		sm: "h-2",
		md: "h-3",
		lg: "h-4",
		xl: "h-6",
	},
};

export const colorClass = {
	bg: {
		default: "bg-muted/30",
		primary: "bg-primary/30",
		secondary: "bg-secondary/30",
		foreground: "bg-foreground/30",
		muted: "bg-muted/30",
		accent: "bg-accent/30",
		success: "bg-emerald-600/30 dark:bg-emerald-500/30",
		warning: "bg-amber-600/30 dark:bg-amber-500/30",
		destructive: "bg-destructive/30",
		white: "bg-white/30",
	},
	shimmer: {
		default: "bg-gradient-to-r from-transparent via-muted/70 to-transparent",
		primary: "bg-gradient-to-r from-transparent via-primary/70 to-transparent",
		secondary:
			"bg-gradient-to-r from-transparent via-secondary/70 to-transparent",
		foreground:
			"bg-gradient-to-r from-transparent via-foreground/70 to-transparent",
		muted: "bg-gradient-to-r from-transparent via-muted/70 to-transparent",
		accent: "bg-gradient-to-r from-transparent via-accent/70 to-transparent",
		success:
			"bg-gradient-to-r from-transparent via-emerald-600/70 dark:via-emerald-500/70 to-transparent",
		warning:
			"bg-gradient-to-r from-transparent via-amber-600/70 dark:via-amber-500/70 to-transparent",
		destructive:
			"bg-gradient-to-r from-transparent via-destructive/70 to-transparent",
		white: "bg-gradient-to-r from-transparent via-white/70 to-transparent",
	},
};

// Animation presets pour framer-motion
export const loaderAnimations = {
	shimmer: {
		initial: {
			translateX: "-100%",
		},
		animate: {
			translateX: "100%",
			transition: {
				duration: 1.8,
				repeat: Infinity,
				ease: "easeInOut",
			},
		},
	},
};
