// Animation presets pour le loader en plein écran
export const fullscreenAnimations = {
	overlay: {
		initial: {
			opacity: 0,
			backdropFilter: "blur(0px)",
		},
		animate: {
			opacity: 1,
			backdropFilter: "blur(5px)",
			transition: {
				duration: 0.4,
				ease: [0.22, 1, 0.36, 1], // custom easing (cubic bezier)
				when: "beforeChildren",
			},
		},
		exit: {
			opacity: 0,
			backdropFilter: "blur(0px)",
			transition: {
				duration: 0.3,
				ease: "easeOut",
				when: "afterChildren",
			},
		},
	},
	content: {
		initial: {
			opacity: 0,
			scale: 0.85,
			y: 10,
		},
		animate: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				duration: 0.35,
				ease: "easeOut",
				delay: 0.1,
			},
		},
		exit: {
			opacity: 0,
			scale: 0.9,
			y: -8,
			transition: {
				duration: 0.25,
				ease: "easeIn",
			},
		},
	},
	closeButton: {
		initial: {
			opacity: 0,
			scale: 0.8,
			rotate: -90,
		},
		animate: {
			opacity: 1,
			scale: 1,
			rotate: 0,
			transition: {
				duration: 0.3,
				delay: 0.3,
				ease: "backOut",
			},
		},
		exit: {
			opacity: 0,
			scale: 0.8,
			transition: {
				duration: 0.2,
				ease: "easeIn",
			},
		},
		hover: {
			scale: 1.05,
			backgroundColor: "rgba(0, 0, 0, 0.1)",
			transition: {
				duration: 0.2,
				ease: "easeOut",
			},
		},
	},
	progressBar: {
		container: {
			initial: { opacity: 0 },
			animate: {
				opacity: 1,
				transition: { delay: 0.5 },
			},
			exit: {
				opacity: 0,
				transition: { duration: 0.2 },
			},
		},
		bar: {
			initial: { width: "0%" },
			animate: {
				width: ["0%", "40%", "60%", "100%", "100%"],
				transition: {
					duration: 2.5,
					ease: "easeInOut",
					repeat: Infinity,
					times: [0, 0.4, 0.6, 0.8, 1],
				},
			},
		},
	},
};
