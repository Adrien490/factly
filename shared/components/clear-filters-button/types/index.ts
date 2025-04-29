import { ButtonHTMLAttributes } from "react";

export interface ClearFiltersButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	/**
	 * Liste des noms de filtres à supprimer
	 */
	filters: string[];

	/**
	 * Liste des noms de filtres à exclure de la suppression
	 */
	excludeFilters?: string[];

	/**
	 * Texte du bouton
	 * @default "Effacer les filtres"
	 */
	label?: string;

	/**
	 * Préfixe pour les clés de filtre dans l'URL
	 */
	prefix?: string;

	/**
	 * Callback appelé après la suppression des filtres
	 */
	onClear?: () => void;
}
