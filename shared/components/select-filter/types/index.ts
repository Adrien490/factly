/**
 * Option de filtre à afficher dans le select
 */
export type FilterOption = {
	value: string;
	label: string;
};

/**
 * Props du composant SelectFilter
 */
export interface SelectFilterProps {
	/**
	 * Clé unique pour identifier ce filtre dans l'URL
	 */
	filterKey: string;

	/**
	 * Label affiché avant le select
	 */
	label: string;

	/**
	 * Liste des options disponibles
	 */
	options: FilterOption[];

	/**
	 * Texte affiché quand aucune valeur n'est sélectionnée
	 */
	placeholder?: string;

	/**
	 * Classes CSS additionnelles
	 */
	className?: string;

	/**
	 * Hauteur maximale du menu déroulant en pixels
	 */
	maxHeight?: number;
}
