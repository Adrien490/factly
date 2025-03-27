"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { DateRange, DateValue } from "../types";

/**
 * Hook pour gérer l'état du filtrage avec une plage de dates
 * Gère la synchronisation des dates avec les paramètres d'URL
 */
export default function useDateRangeFilter(filterKey: string) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Préfixes pour les filtres dans l'URL
	const fromParamKey = `from_${filterKey}`;
	const toParamKey = `to_${filterKey}`;

	// Récupérer les valeurs actuelles du filtre
	const currentFromDate = searchParams.get(fromParamKey) || null;
	const currentToDate = searchParams.get(toParamKey) || null;

	// État optimiste pour une meilleure UX
	const [optimisticRange, setOptimisticRange] = useOptimistic<DateRange>({
		from: currentFromDate,
		to: currentToDate,
	});

	// Mise à jour de l'URL avec les nouveaux paramètres
	const updateUrlWithParams = (
		params: URLSearchParams,
		newRange: DateRange
	) => {
		startTransition(() => {
			setOptimisticRange(newRange);
			router.push(`?${params.toString()}`, { scroll: false });
		});
	};

	// Préservation des paramètres existants
	const preserveExistingParams = () => {
		const params = new URLSearchParams(searchParams);
		return params;
	};

	// Définir une nouvelle plage de dates
	const setDateRange = (range: DateRange) => {
		const params = preserveExistingParams();

		// Supprimer d'abord les paramètres existants
		params.delete(fromParamKey);
		params.delete(toParamKey);

		// Ajouter les nouvelles valeurs si elles existent
		if (range.from) {
			params.set(fromParamKey, range.from);
		}

		if (range.to) {
			params.set(toParamKey, range.to);
		}

		// IMPORTANT: Réinitialiser la pagination à la page 1 quand un filtre change
		params.set("page", "1");

		updateUrlWithParams(params, range);
	};

	// Définir uniquement la date de début
	const setFromDate = (date: DateValue) => {
		setDateRange({ ...optimisticRange, from: date });
	};

	// Définir uniquement la date de fin
	const setToDate = (date: DateValue) => {
		setDateRange({ ...optimisticRange, to: date });
	};

	// Effacer le filtre
	const clearDateRange = () => {
		const params = preserveExistingParams();
		params.delete(fromParamKey);
		params.delete(toParamKey);

		// Réinitialiser également la pagination à la page 1
		params.set("page", "1");

		updateUrlWithParams(params, { from: null, to: null });
	};

	return {
		dateRange: optimisticRange,
		setDateRange,
		setFromDate,
		setToDate,
		clearDateRange,
		isPending,
	};
}
