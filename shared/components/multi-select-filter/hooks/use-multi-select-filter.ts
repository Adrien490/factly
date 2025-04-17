"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";

/**
 * Hook pour gérer l'état du filtrage avec un select multiple
 * Gère un filtre avec plusieurs valeurs
 */
export function useMultiSelectFilter(filterKey: string) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Utiliser directement la clé du filtre sans préfixe
	const paramKey = filterKey;

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
	const preserveExistingParams = () => {
		const params = new URLSearchParams(searchParams);
		return params;
	};

	// Définir les nouvelles valeurs de filtre
	const setFilter = (values: string[]) => {
		const params = preserveExistingParams();

		// Supprimer d'abord tous les paramètres de ce filtre
		params.delete(paramKey);

		// Filtrer la valeur "all" pour les paramètres URL, mais la conserver dans l'état optimiste
		const validParams = values.filter((val) => val && val !== "all");

		// Ajouter les nouvelles valeurs valides aux paramètres URL
		validParams.forEach((val) => {
			params.append(paramKey, val);
		});

		// IMPORTANT: Réinitialiser la pagination à la page 1 quand un filtre change
		// Cela permet d'éviter des pages vides quand le nombre de résultats diminue
		params.set("page", "1");

		// Mettre à jour avec toutes les valeurs pour l'UI, mais seulement les valides pour l'URL
		updateUrlWithParams(params, values);
	};

	// Ajouter ou supprimer une valeur
	const toggleValue = (value: string) => {
		if (isSelected(value)) {
			// Si la valeur est déjà sélectionnée, on la supprime
			setFilter(optimisticValues.filter((val) => val !== value));
		} else {
			// Sinon on l'ajoute
			setFilter([...optimisticValues, value]);
		}
	};

	// Effacer le filtre
	const clearFilter = () => {
		const params = preserveExistingParams();
		params.delete(paramKey);

		// Réinitialiser également la pagination à la page 1 quand on efface un filtre
		params.set("page", "1");

		updateUrlWithParams(params, []);
	};

	// Vérifier si une valeur est sélectionnée
	const isSelected = (value: string) => optimisticValues.includes(value);

	// Vérifier si toutes les valeurs sont sélectionnées
	const areAllSelected = (values: string[]) =>
		values.length > 0 &&
		values.every((value) => optimisticValues.includes(value));

	return {
		values: optimisticValues,
		setFilter,
		toggleValue,
		clearFilter,
		isSelected,
		areAllSelected,
		isPending,
	};
}
