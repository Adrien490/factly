"use client";

import { cn } from "@/shared/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useLinkStatus } from "next/link";
import { MiniDotsLoader } from "../loaders";

export function LoadingIndicator({ className }: { className?: string }) {
	const { pending } = useLinkStatus();

	return (
		<AnimatePresence>
			{pending && (
				<motion.div
					initial={{ opacity: 0.1 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0.1 }}
					transition={{
						opacity: {
							delay: 0.1, // Délai initial de 100ms
							duration: 0.3,
						},
					}}
					className={cn(
						"loading-indicator flex items-center justify-center",
						className
					)}
				>
					<MiniDotsLoader
						className="loading-indicator"
						color="default"
						size="sm"
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
