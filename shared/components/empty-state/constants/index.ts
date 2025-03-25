export const animations = {
	container: {
		initial: { opacity: 0, y: 10 },
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.4,
				ease: "easeOut",
				when: "beforeChildren",
				staggerChildren: 0.1,
			},
		},
	},
	item: {
		initial: { opacity: 0, y: 10 },
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.3,
				ease: "easeOut",
			},
		},
	},
	icon: {
		initial: { opacity: 0, scale: 0.8 },
		animate: {
			opacity: 1,
			scale: 1,
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 15,
			},
		},
	},
};
