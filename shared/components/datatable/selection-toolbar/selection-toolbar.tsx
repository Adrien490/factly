"use client";

import { Button } from "@/shared/components";
import { useSelectionContext } from "@/shared/contexts";
import { AnimatePresence, motion } from "framer-motion";
import { CheckSquare, X } from "lucide-react";

type Props = {
	actions?: React.ReactNode;
};

export function SelectionToolbar({ actions }: Props) {
	const { getSelectedCount, clearSelection } = useSelectionContext();
	const selectedCount = getSelectedCount();
	const hasSelection = selectedCount > 0;

	return (
		<AnimatePresence mode="wait">
			{hasSelection && (
				<motion.div
					initial={{ opacity: 0, y: -20, scale: 0.97 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -15, scale: 0.98 }}
					transition={{
						type: "spring",
						stiffness: 400,
						damping: 25,
						mass: 0.9,
						exit: { duration: 0.15 },
					}}
					className="flex items-center justify-between px-4 py-2 bg-background border-b border-b-slate-200 dark:border-b-slate-700 overflow-hidden"
				>
					<div className="flex items-center gap-2 h-8">
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.1, duration: 0.2 }}
							exit={{ transition: { duration: 0.05 } }}
						>
							<CheckSquare className="h-4 w-4 text-primary" />
						</motion.div>
						<motion.span
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.15, duration: 0.2 }}
							exit={{ transition: { duration: 0.05 } }}
							className="text-sm font-medium"
						>
							{`${selectedCount} ${
								selectedCount > 1
									? "éléments sélectionnés"
									: "élément sélectionné"
							}`}
						</motion.span>
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2, duration: 0.2 }}
							exit={{ transition: { duration: 0.05 } }}
						>
							<Button
								variant="ghost"
								size="sm"
								onClick={clearSelection}
								className="h-7 px-2 text-xs"
							>
								<X className="h-3.5 w-3.5 mr-1" />
								Effacer
							</Button>
						</motion.div>
					</div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.25, duration: 0.3 }}
						exit={{ transition: { duration: 0.05 } }}
						className="flex items-center h-8"
					>
						{actions ? actions : <div className="w-px h-px" />}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
