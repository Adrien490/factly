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
		<Card className="mb-6">
			<CardContent className={`flex flex-wrap gap-2 sm:gap-3 ${className}`}>
				{children}
			</CardContent>
		</Card>
	);
}
