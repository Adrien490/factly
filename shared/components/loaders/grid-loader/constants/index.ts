export const sizeClasses = {
	container: {
		xs: "h-9 w-9",
		sm: "h-12 w-12",
		md: "h-16 w-16",
		lg: "h-20 w-20",
		xl: "h-24 w-24",
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
	container: {
		initial: { opacity: 0 },
		animate: {
			opacity: 1,
			transition: {
				staggerChildren: 0.05,
				delayChildren: 0.1,
			},
		},
	},
	item: {
		initial: {
			opacity: 0,
			scale: 0.5,
		},
		animate: (i: number) => {
			// Obtient la position dans la grille (0-8)
			// On peut créer différents patterns d'animation basés sur l'index
			const row = Math.floor(i / 3);
			const col = i % 3;
			const isCenter = row === 1 && col === 1;
			const isCorner = (row === 0 || row === 2) && (col === 0 || col === 2);

			// Différentes animations selon la position
			return {
				opacity: [0, 1, 0],
				scale: isCenter
					? [0.3, 1, 0.3]
					: isCorner
					? [0.5, 0.8, 0.5]
					: [0.4, 0.9, 0.4],
				transition: {
					duration: 1.5,
					repeat: Infinity,
					delay: isCenter ? 0.1 : isCorner ? 0.2 : 0,
					ease: "easeInOut",
				},
			};
		},
	},
};
