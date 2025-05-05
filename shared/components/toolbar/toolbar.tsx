import { ReactNode } from "react";
import { Card, CardContent } from "../ui";

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
		<Card>
			<CardContent
				className={`flex flex-wrap gap-2 sm:gap-3 mb-6 ${className}`}
			>
				{children}
			</CardContent>
		</Card>
	);
}
