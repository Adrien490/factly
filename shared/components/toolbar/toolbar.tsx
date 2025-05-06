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
			className={`mb-4 flex flex-wrap items-center justify-between py-2 gap-2 sm:gap-3 ${className}`}
		>
			{children}
		</div>
	);
}
