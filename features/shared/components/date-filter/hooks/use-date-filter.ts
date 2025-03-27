"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { DateValue } from "../../date-range-filter/types";

/**
 * Hook pour gérer l'état du filtrage avec une date unique
 * Gère la synchronisation de la date avec les paramètres d'URL
 */
export default function useDateFilter(filterKey: string) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Clé du paramètre dans l'URL
	const paramKey = `date_${filterKey}`;

	// Récupérer la valeur actuelle du filtre
	const currentDate = searchParams.get(paramKey) || null;

	// État optimiste pour une meilleure UX
	const [optimisticDate, setOptimisticDate] =
		useOptimistic<DateValue>(currentDate);

	// Mise à jour de l'URL avec les nouveaux paramètres
	const updateUrlWithParams = (params: URLSearchParams, newDate: DateValue) => {
		startTransition(() => {
			setOptimisticDate(newDate);
			router.push(`?${params.toString()}`, { scroll: false });
		});
	};

	// Préservation des paramètres existants
	const preserveExistingParams = () => {
		const params = new URLSearchParams(searchParams);
		return params;
	};

	// Définir une nouvelle date
	const setDate = (date: DateValue) => {
		const params = preserveExistingParams();

		// Supprimer d'abord le paramètre existant
		params.delete(paramKey);

		// Ajouter la nouvelle valeur si elle existe
		if (date) {
			params.set(paramKey, date);
		}

		// IMPORTANT: Réinitialiser la pagination à la page 1 quand un filtre change
		params.set("page", "1");

		updateUrlWithParams(params, date);
	};

	// Effacer le filtre
	const clearDate = () => {
		const params = preserveExistingParams();
		params.delete(paramKey);

		// Réinitialiser également la pagination à la page 1
		params.set("page", "1");

		updateUrlWithParams(params, null);
	};

	return {
		date: optimisticDate,
		setDate,
		clearDate,
		isPending,
	};
}
