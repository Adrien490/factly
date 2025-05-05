import { ReactNode } from "react";

interface ToolbarProps {
	/**
	 * Contenu de la barre d'outils
	 */
	children: ReactNode;

	/**
	 * Classes CSS additionnelles
	 */
	className?: string;
}

/**
 * Barre d'outils responsive pour les tables de données
 */
export function Toolbar({ children, className = "" }: ToolbarProps) {
	return (
		<div
			className={`mb-6 flex flex-wrap items-center gap-2 sm:gap-3 justify-between pb-2 ${className}`}
		>
			{children}
		</div>
	);
}
