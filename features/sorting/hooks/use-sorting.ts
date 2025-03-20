"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";

export type SortDirection = "asc" | "desc";

export interface SortingState {
	column: string | null;
	direction: SortDirection | null;
}

interface UseSortingOptions {
	/**
	 * Colonne de tri par défaut
	 */
	defaultColumn?: string;
	/**
	 * Direction de tri par défaut
	 */
	defaultDirection?: SortDirection;
	/**
	 * Préserver les paramètres d'URL existants
	 * @default true
	 */
	preserveParams?: boolean;
}

export function useSorting(options: UseSortingOptions = {}) {
	const {
		defaultColumn = null,
		defaultDirection = "asc",
		preserveParams = true,
	} = options;

	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Récupération des paramètres de tri depuis l'URL
	const sortColumn = searchParams.get("sortBy") || defaultColumn;
	const sortDirection =
		(searchParams.get("sortOrder") as SortDirection) || defaultDirection;

	// État optimiste pour une UI réactive
	const [optimisticSort, setOptimisticSort] = useOptimistic<SortingState>({
		column: sortColumn,
		direction: sortDirection,
	});

	/**
	 * Met à jour l'URL avec les nouveaux paramètres
	 */
	const updateUrlWithParams = (params: URLSearchParams) => {
		startTransition(() => {
			router.push(`?${params.toString()}`, { scroll: false });
		});
	};

	/**
	 * Préserve les paramètres d'URL existants
	 */
	const getUpdatedParams = () => {
		return new URLSearchParams(preserveParams ? searchParams : undefined);
	};

	/**
	 * Change la colonne de tri
	 */
	const sortBy = (column: string | null) => {
		const params = getUpdatedParams();

		startTransition(() => {
			if (!column) {
				params.delete("sortBy");
				params.delete("sortOrder");
				setOptimisticSort({ column: null, direction: null });
			} else if (column === optimisticSort.column) {
				// Cycle: asc -> desc -> clear
				if (optimisticSort.direction === "asc") {
					params.set("sortBy", column);
					params.set("sortOrder", "desc");
					setOptimisticSort({ column, direction: "desc" });
				} else {
					params.delete("sortBy");
					params.delete("sortOrder");
					setOptimisticSort({ column: null, direction: null });
				}
			} else {
				// Nouvelle colonne -> direction par défaut
				params.set("sortBy", column);
				params.set("sortOrder", defaultDirection);
				setOptimisticSort({ column, direction: defaultDirection });
			}

			updateUrlWithParams(params);
		});
	};

	/**
	 * Change la direction de tri
	 */
	const setDirection = (direction: SortDirection | null) => {
		const params = getUpdatedParams();

		startTransition(() => {
			if (!direction || !optimisticSort.column) {
				params.delete("sortBy");
				params.delete("sortOrder");
				setOptimisticSort({ column: null, direction: null });
			} else {
				params.set("sortBy", optimisticSort.column);
				params.set("sortOrder", direction);
				setOptimisticSort({ ...optimisticSort, direction });
			}

			updateUrlWithParams(params);
		});
	};

	/**
	 * Réinitialise le tri
	 */
	const clearSort = () => {
		const params = getUpdatedParams();

		startTransition(() => {
			params.delete("sortBy");
			params.delete("sortOrder");
			setOptimisticSort({ column: null, direction: null });
			updateUrlWithParams(params);
		});
	};

	return {
		// État
		isPending,
		column: optimisticSort.column,
		direction: optimisticSort.direction,

		// Actions
		sortBy,
		setDirection,
		clearSort,

		// Helpers
		isSortedBy: (column: string) => optimisticSort.column === column,
		getSortDirection: (column: string) =>
			optimisticSort.column === column ? optimisticSort.direction : null,
	};
}
