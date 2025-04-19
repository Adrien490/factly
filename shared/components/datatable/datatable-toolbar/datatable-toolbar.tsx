"use client";

import { ReactNode } from "react";

interface DataTableToolbarProps {
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
export function DataTableToolbar({
	leftContent,
	rightContent,
	className = "",
}: DataTableToolbarProps) {
	return (
		<div
			className={`mb-6 flex flex-wrap items-center justify-between gap-4 pb-2 ${className}`}
		>
			{leftContent && (
				<div className="flex flex-wrap items-center gap-3">{leftContent}</div>
			)}

			{rightContent && (
				<div className="flex flex-wrap items-center gap-3">{rightContent}</div>
			)}
		</div>
	);
}
