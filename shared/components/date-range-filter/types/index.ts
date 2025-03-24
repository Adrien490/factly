/**
 * Type pour une date au format ISO string ou null
 */
export type DateValue = string | null;

/**
 * Type pour une plage de dates
 */
export interface DateRange {
	from: DateValue;
	to: DateValue;
}

/**
 * Props du composant DateRangeFilter
 */
export interface DateRangeFilterProps {
	/**
	 * Clé unique pour identifier ce filtre dans l'URL (sera préfixé par 'from_' et 'to_')
	 */
	filterKey: string;

	/**
	 * Label affiché avant le sélecteur de dates
	 */
	label: string;

	/**
	 * Texte affiché quand aucune date n'est sélectionnée
	 */
	placeholder?: string;

	/**
	 * Format d'affichage des dates
	 */
	format?: string;

	/**
	 * Date minimale sélectionnable
	 */
	minDate?: Date;

	/**
	 * Date maximale sélectionnable
	 */
	maxDate?: Date;

	/**
	 * Classes CSS additionnelles
	 */
	className?: string;

	/**
	 * Callbacks appelé lorsque la plage de dates change
	 */
	onDateRangeChange?: (range: DateRange) => void;
}
