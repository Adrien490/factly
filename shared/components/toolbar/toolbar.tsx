import { ReactNode } from "react";

interface ToolbarProps {
	/**
	 * Éléments à afficher sur le côté gauche de la barre d'outils
	 */
	leftContent?: ReactNode;

	/**
	 * Éléments à afficher sur le côté droit de la barre d'outils
	 */
	rightContent?: ReactNode;

	/**
	 * Classes CSS additionnelles
	 */
	className?: string;
}

/**
 * Barre d'outils responsive pour les tables de données
 * Permet de définir les éléments à gauche (recherche, filtres) et à droite (actions, tri)
 */
export function Toolbar({
	leftContent,
	rightContent,
	className = "",
}: ToolbarProps) {
	return (
		<div
			className={`mb-6 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:justify-between sm:items-center sm:gap-4 pb-2 ${className}`}
		>
			{leftContent && (
				<div className="w-full flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0">
					{leftContent}
				</div>
			)}

			{rightContent && (
				<div className="w-full sm:w-auto flex flex-wrap items-center gap-2 sm:gap-3 justify-between sm:justify-end sm:shrink-0">
					{rightContent}
				</div>
			)}
		</div>
	);
}
