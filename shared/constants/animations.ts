import { Transition, Variants } from "framer-motion";

// Constants pour les timings des animations
export const STAGGER_CHILD_VARIANTS = 0.1;
export const DEFAULT_DURATION = 0.3;
export const FAST_DURATION = 0.2;
export const SLOW_DURATION = 0.5;

// Transitions réutilisables
export const defaultTransition: Transition = {
	type: "tween",
	ease: "easeInOut",
	duration: 0.3,
};

export const springTransition: Transition = {
	type: "spring",
	stiffness: 100,
	damping: 20,
};

// Animations de liste et d'items
export const listVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.1,
		},
	},
	exit: { opacity: 0 },
};
export const itemVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: defaultTransition,
	},
	exit: { opacity: 0 },
	hover: { y: -5 },
};

export const cardVariants: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: defaultTransition,
	},
	hover: { scale: 1.02 },
	tap: { scale: 0.98 },
	exit: { opacity: 0 },
};
