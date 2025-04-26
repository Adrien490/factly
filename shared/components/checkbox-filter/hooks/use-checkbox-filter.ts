"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";

export function useCheckboxFilter(filterKey: string) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Récupérer les valeurs actuelles du filtre
	const currentValues = searchParams.getAll(filterKey);

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

	// Toggle d'une valeur de filtre (ajouter/supprimer)
	const toggleFilter = (value: string) => {
		const params = preserveExistingParams();

		// Supprimer tous les paramètres de ce filtre
		params.delete(filterKey);

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
			params.append(filterKey, v);
		});

		// Réinitialiser la pagination à la page 1 quand un filtre change
		params.set("page", "1");

		updateUrlWithParams(params, newValues);
	};

	// Effacer le filtre
	const clearFilter = () => {
		const params = preserveExistingParams();
		params.delete(filterKey);

		// Réinitialiser la pagination à la page 1
		params.set("page", "1");

		updateUrlWithParams(params, []);
	};

	// Vérifier si une valeur est sélectionnée
	const isSelected = (value: string) => optimisticValues.includes(value);

	return {
		values: optimisticValues,
		toggleFilter,
		clearFilter,
		isSelected,
		isPending,
	};
}
