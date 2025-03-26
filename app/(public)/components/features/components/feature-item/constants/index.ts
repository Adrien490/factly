export const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 24,
			duration: 0.4,
		},
	},
};
