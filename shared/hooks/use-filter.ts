"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";

export interface UseFilterOptions {
	/**
	 * Préfixe pour les clés de filtre dans l'URL (par défaut: aucun)
	 */
	prefix?: string;
	/**
	 * Réinitialiser la pagination à 1 quand un filtre change
	 * @default true
	 */
	resetPagination?: boolean;
	/**
	 * Préserver les autres paramètres d'URL existants
	 * @default true
	 */
	preserveParams?: boolean;
}

export function useFilter(filterKey: string, options: UseFilterOptions = {}) {
	const {
		prefix = "",
		resetPagination = true,
		preserveParams = true,
	} = options;

	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Construire la clé complète du filtre (avec préfixe si spécifié)
	const paramKey = prefix ? `${prefix}${filterKey}` : filterKey;

	// Récupérer les valeurs actuelles du filtre
	const currentValues = searchParams.getAll(paramKey);

	// État optimiste pour une meilleure UX
	const [optimisticValues, setOptimisticValues] =
		useOptimistic<string[]>(currentValues);

	// Mise à jour de l'URL avec les nouveaux paramètres
	const updateUrlWithParams = (
		params: URLSearchParams,
		newValues: string[]
	) => {
		startTransition(() => {
			setOptimisticValues(newValues);
			router.push(`?${params.toString()}`, { scroll: false });
		});
	};

	// Préservation des paramètres existants
	const getParams = () => {
		return new URLSearchParams(preserveParams ? searchParams : undefined);
	};

	// Définir une valeur de filtre (remplace les valeurs existantes)
	const setFilter = (value: string | null) => {
		const params = getParams();

		// Supprimer d'abord tous les paramètres de ce filtre
		params.delete(paramKey);

		// Si la valeur est null ou "all", nous supprimons simplement le paramètre
		if (value && value !== "all") {
			params.append(paramKey, value);
		}

		// Réinitialiser la pagination si nécessaire
		if (resetPagination) {
			params.set("page", "1");
		}

		updateUrlWithParams(params, value ? [value] : []);
	};

	// Définir plusieurs valeurs de filtre
	const setFilters = (values: string[]) => {
		const params = getParams();

		// Supprimer d'abord tous les paramètres de ce filtre
		params.delete(paramKey);

		// Ajouter les nouvelles valeurs
		values.forEach((value) => {
			if (value && value !== "all") {
				params.append(paramKey, value);
			}
		});

		// Réinitialiser la pagination si nécessaire
		if (resetPagination) {
			params.set("page", "1");
		}

		updateUrlWithParams(params, values);
	};

	// Toggle d'une valeur de filtre (ajouter/supprimer)
	const toggleFilter = (value: string) => {
		const params = getParams();

		// Supprimer tous les paramètres de ce filtre
		params.delete(paramKey);

		// Créer le nouvel ensemble de valeurs
		let newValues: string[];

		if (optimisticValues.includes(value)) {
			// Si la valeur existe déjà, on la supprime
			newValues = optimisticValues.filter((v) => v !== value);
		} else {
			// Sinon on l'ajoute
			newValues = [...optimisticValues, value];
		}

		// Ajouter les nouvelles valeurs au paramètre
		newValues.forEach((v) => {
			params.append(paramKey, v);
		});

		// Réinitialiser la pagination si nécessaire
		if (resetPagination) {
			params.set("page", "1");
		}

		updateUrlWithParams(params, newValues);
	};

	// Effacer le filtre
	const clearFilter = () => {
		const params = getParams();
		params.delete(paramKey);

		// Réinitialiser la pagination si nécessaire
		if (resetPagination) {
			params.set("page", "1");
		}

		updateUrlWithParams(params, []);
	};

	// Vérifier si une valeur est sélectionnée
	const isSelected = (value: string) => optimisticValues.includes(value);

	// Vérifier si le filtre a des valeurs
	const hasValues = () => optimisticValues.length > 0;

	return {
		// État
		values: optimisticValues,
		isEmpty: !hasValues(),
		isPending,

		// Actions
		setFilter, // Pour les filtres à valeur unique (select, radio)
		setFilters, // Pour définir plusieurs valeurs à la fois
		toggleFilter, // Pour les filtres à valeurs multiples (checkbox)
		clearFilter, // Pour effacer le filtre

		// Helpers
		isSelected, // Vérifier si une valeur est sélectionnée
		hasValue: hasValues, // Alias plus lisible
	};
}
