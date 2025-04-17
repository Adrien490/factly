"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { SortDirection, SortField, SortingOptionsState } from "./types";

/**
 * Hook pour gérer les options de tri avec état optimiste
 * Permet de mettre à jour l'URL et l'état de l'interface de manière fluide
 */
export function useSortingOptions(
	sortFields: SortField[],
	defaultSortBy: string = "createdAt",
	defaultSortOrder: SortDirection = "desc"
): SortingOptionsState {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Récupérer les valeurs actuelles des paramètres de tri
	const currentSortBy = searchParams.get("sortBy") || defaultSortBy;
	const currentSortOrder =
		(searchParams.get("sortOrder") as SortDirection) || defaultSortOrder;

	// État optimiste pour une expérience utilisateur fluide
	const [optimisticSort, setOptimisticSort] = useOptimistic<{
		field: string;
		order: SortDirection;
	}>({ field: currentSortBy, order: currentSortOrder });

	// Trouver le champ de tri actuel
	const currentField = sortFields.find(
		(field) => field.value === optimisticSort.field
	);

	// Fonction pour mettre à jour les paramètres de tri
	const updateSort = (field: string, order: SortDirection) => {
		// Mettre à jour l'état optimiste immédiatement
		startTransition(() => {
			setOptimisticSort({ field, order });

			const params = new URLSearchParams(searchParams.toString());
			params.set("sortBy", field);
			params.set("sortOrder", order);

			// Réinitialiser la pagination à 1 lors d'un changement de tri
			params.set("page", "1");

			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		});
	};

	return {
		currentSortBy: optimisticSort.field,
		currentSortOrder: optimisticSort.order,
		isPending,
		updateSort,
		sortFields,
		currentField,
	};
}
