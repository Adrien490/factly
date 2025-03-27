"use client";

import { cn } from "@/features/shared/lib/utils";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { X } from "lucide-react";
import { Loader } from "../../loader";
import { bgColorClass } from "../../loader/constants";
import { fullscreenAnimations } from "../constants";
import { LoaderFullscreenProps } from "../types";

export function LoaderFullscreen({
	text,
	size = "lg",
	variant = "spinner",
	color = "primary",
	overlayColor = "rgba(255, 255, 255, 0.9)",
	zIndex = 50,
	showCloseButton = false,
	onClose,
	className,
	transitionDuration,
	blurStrength = 5,
	showProgressBar = true,
	...props
}: Omit<HTMLMotionProps<"div">, "color"> & LoaderFullscreenProps) {
	// Personnalisation des animations avec les props spécifiques
	const customOverlayAnimations = transitionDuration
		? {
				...fullscreenAnimations.overlay,
				animate: {
					...fullscreenAnimations.overlay.animate,
					backdropFilter: `blur(${blurStrength}px)`,
					transition: {
						...fullscreenAnimations.overlay.animate.transition,
						duration: transitionDuration,
					},
				},
				exit: {
					...fullscreenAnimations.overlay.exit,
					transition: {
						...fullscreenAnimations.overlay.exit.transition,
						duration: transitionDuration * 0.75,
					},
				},
		  }
		: {
				...fullscreenAnimations.overlay,
				animate: {
					...fullscreenAnimations.overlay.animate,
					backdropFilter: `blur(${blurStrength}px)`,
				},
		  };

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key="loader-fullscreen"
				variants={customOverlayAnimations}
				initial="initial"
				animate="animate"
				exit="exit"
				className={cn(
					"fixed inset-0 flex flex-col items-center justify-center",
					className
				)}
				style={{
					backgroundColor: overlayColor,
					zIndex,
				}}
				{...props}
			>
				{showCloseButton && onClose && (
					<motion.button
						variants={fullscreenAnimations.closeButton}
						initial="initial"
						animate="animate"
						exit="exit"
						whileHover="hover"
						className="absolute top-4 right-4 p-2 rounded-full transition-colors"
						onClick={onClose}
						aria-label="Fermer"
					>
						<X className="h-5 w-5" />
					</motion.button>
				)}

				<motion.div
					variants={fullscreenAnimations.content}
					className="flex flex-col items-center"
				>
					<Loader text={text} size={size} variant={variant} color={color} />

					{/* Indicateur de progression */}
					{text && showProgressBar && (
						<motion.div
							variants={fullscreenAnimations.progressBar.container}
							className="mt-8 overflow-hidden relative w-48 h-1 rounded-full"
						>
							<motion.div
								variants={fullscreenAnimations.progressBar.bar}
								className={cn("h-full rounded-full", bgColorClass[color])}
							/>
						</motion.div>
					)}
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
