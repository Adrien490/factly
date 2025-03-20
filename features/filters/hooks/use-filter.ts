"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";

export type FilterValue = string | string[];

export function useFilter(filterKey: string) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Préfixe pour les filtres dans l'URL
	const paramKey = `filter_${filterKey}`;

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

	// Définir une nouvelle valeur de filtre (simple ou multiple)
	const setFilter = (value: FilterValue) => {
		const params = preserveExistingParams();

		// Supprimer d'abord tous les paramètres de ce filtre
		params.delete(paramKey);

		// Convertir en tableau pour traitement uniforme
		const values = Array.isArray(value) ? value : [value];

		// Ajouter les nouvelles valeurs
		values.forEach((val) => {
			if (val) params.append(paramKey, val);
		});

		// IMPORTANT: Réinitialiser la pagination à la page 1 quand un filtre change
		// Cela permet d'éviter des pages vides quand le nombre de résultats diminue
		params.set("page", "1");

		updateUrlWithParams(params, values);
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

	return {
		values: optimisticValues,
		setFilter,
		clearFilter,
		isSelected,
		isPending,
	};
}
