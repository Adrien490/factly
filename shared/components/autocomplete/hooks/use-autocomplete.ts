"use client";

import { useState } from "react";

/**
 * Options pour le hook useAutocomplete
 */
export interface UseAutocompleteOptions {
	/** Nombre minimum de caractères pour déclencher l'autocomplétion */
	minQueryLength?: number;
	/** Délai avant fermeture du menu lors du blur (en ms) */
	blurDelay?: number;
}

/**
 * Interface pour les valeurs retournées par le hook useAutocomplete
 */
export interface UseAutocompleteReturn<T> {
	// Références

	// États
	showResults: boolean;
	hasResults: boolean;

	// Gestionnaires d'événements
	handleFocus: () => void;
	handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
	handleInputChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		onChange: (value: string) => void
	) => void;
	handleItemSelect: (item: T, onSelect: (item: T) => void) => void;
	handleKeyDown: (e: React.KeyboardEvent) => void;
}

/**
 * Hook personnalisé pour gérer la logique d'autocomplétion
 *
 * @param value Valeur actuelle de l'input
 * @param items Tableau d'éléments pour l'autocomplétion
 * @param options Options de configuration (minQueryLength, blurDelay)
 * @returns Objet contenant les références, états et gestionnaires d'événements
 */
export function useAutocomplete<T>(
	value: string,
	items: T[],
	options: UseAutocompleteOptions = {}
): UseAutocompleteReturn<T> {
	const { minQueryLength = 3, blurDelay = 100 } = options;

	// États
	const [isOpen, setIsOpen] = useState(false);

	// Calculs dérivés
	const hasValidQuery = value.length >= minQueryLength;
	const hasResults = items.length > 0;
	const showResults = isOpen && hasValidQuery;

	// Gestionnaires d'événements - version simplifiée sans useCallback
	const handleFocus = () => {
		if (value.length >= minQueryLength) {
			setIsOpen(true);
		}
	};

	const handleBlur = () => {
		// Vérifier si le clic est dans la liste pour éviter de la fermer trop tôt

		// Délai court pour permettre aux clics sur les éléments de liste de se déclencher
		setTimeout(() => {
			setIsOpen(false);
		}, blurDelay);
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		onChange: (value: string) => void
	) => {
		const newValue = e.target.value;
		onChange(newValue);
		setIsOpen(newValue.length >= minQueryLength);
	};

	const handleItemSelect = (item: T, onSelect: (item: T) => void) => {
		onSelect(item);
		setIsOpen(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape" && isOpen) {
			e.preventDefault();
			setIsOpen(false);
		} else if (e.key === "Tab" && isOpen) {
			// Ferme le menu lors de la navigation par tabulation
			setIsOpen(false);
		}
	};

	return {
		// Références

		// États
		showResults,
		hasResults,

		// Gestionnaires d'événements
		handleFocus,
		handleBlur,
		handleInputChange,
		handleItemSelect,
		handleKeyDown,
	};
}
