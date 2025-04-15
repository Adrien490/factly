"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";

export type FilterValue = string;

export function useFilterSelect(filterKey: string) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Préfixe pour les filtres dans l'URL
	const paramKey = `filter_${filterKey}`;

	// Récupérer les valeurs actuelles du filtre
	const currentValues = searchParams.getAll(paramKey);

	// État optimiste pour une meilleure UX
	const [optimisticValue, setOptimisticValue] = useOptimistic<string>(
		currentValues[0]
	);

	// Mise à jour de l'URL avec les nouveaux paramètres
	const updateUrlWithParams = (params: URLSearchParams, newValue: string) => {
		startTransition(() => {
			setOptimisticValue(newValue);
			router.push(`?${params.toString()}`, { scroll: false });
		});
	};

	// Préservation des paramètres existants
	const preserveExistingParams = () => {
		const params = new URLSearchParams(searchParams);
		return params;
	};

	// Définir une nouvelle valeur de filtre (simple ou multiple)
	const setFilter = (value: FilterValue) => {
		const params = preserveExistingParams();

		// Supprimer d'abord tous les paramètres de ce filtre
		params.delete(paramKey);

		// Convertir en tableau pour traitement uniforme

		// Ajouter les nouvelles valeurs
		if (value) params.append(paramKey, value);

		// IMPORTANT: Réinitialiser la pagination à la page 1 quand un filtre change
		// Cela permet d'éviter des pages vides quand le nombre de résultats diminue
		params.set("page", "1");

		updateUrlWithParams(params, value);
	};

	// Effacer le filtre
	const clearFilter = () => {
		const params = preserveExistingParams();
		params.delete(paramKey);

		// Réinitialiser également la pagination à la page 1 quand on efface un filtre
		params.set("page", "1");

		updateUrlWithParams(params, "");
	};

	// Vérifier si une valeur est sélectionnée
	const isSelected = (value: string) => optimisticValue === value;

	return {
		value: optimisticValue,
		setFilter,
		clearFilter,
		isSelected,
		isPending,
	};
}
