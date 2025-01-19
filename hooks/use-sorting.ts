"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";

export type SortingState = {
	column: string | null;
	direction: "asc" | "desc" | null;
};

export function useSorting() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const sortColumn = searchParams.get("sortBy");
	const sortDirection = searchParams.get("sortOrder") as "asc" | "desc" | null;

	const [optimisticSort, setOptimisticSort] = useOptimistic<SortingState>({
		column: sortColumn,
		direction: sortDirection,
	});

	const updateUrlWithParams = (params: URLSearchParams) => {
		startTransition(() => {
			router.push(`?${params.toString()}`, { scroll: false });
		});
	};

	const preserveExistingParams = () => {
		const params = new URLSearchParams(searchParams);
		params.set("page", "1"); // Réinitialiser la pagination lors du tri

		// Préserver les autres paramètres
		const filters: Record<string, string> = {};
		params.forEach((value, key) => {
			if (key.startsWith("filter_")) {
				filters[key.replace("filter_", "")] = value;
			}
		});

		return { params, filters };
	};

	const handleSortingChange = (columnId: string) => {
		const { params } = preserveExistingParams();

		// Si on clique sur une nouvelle colonne -> asc
		// Si on clique sur la même colonne -> toggle asc/desc
		const newDirection =
			optimisticSort.column === columnId && optimisticSort.direction === "asc"
				? "desc"
				: "asc";

		startTransition(() => {
			setOptimisticSort({
				column: columnId,
				direction: newDirection,
			});

			// Mise à jour des paramètres d'URL
			params.set("sortBy", columnId);
			params.set("sortOrder", newDirection);
			updateUrlWithParams(params);
		});
	};

	const getSortingState = (): SortingState => ({
		column: optimisticSort.column,
		direction: optimisticSort.direction,
	});

	const isSortedBy = (columnId: string): boolean => {
		return optimisticSort.column === columnId;
	};

	const getSortOrder = (columnId: string): "asc" | "desc" | null => {
		if (!isSortedBy(columnId)) return null;
		return optimisticSort.direction;
	};

	const clearSort = () => {
		const { params } = preserveExistingParams();
		params.delete("sortBy");
		params.delete("sortOrder");

		startTransition(() => {
			setOptimisticSort({
				column: null,
				direction: null,
			});
			updateUrlWithParams(params);
		});
	};

	const setSorting = (columnId: string, direction: "asc" | "desc") => {
		const { params } = preserveExistingParams();

		startTransition(() => {
			setOptimisticSort({
				column: columnId,
				direction,
			});

			params.set("sortBy", columnId);
			params.set("sortOrder", direction);
			updateUrlWithParams(params);
		});
	};

	return {
		isPending,
		handleSortingChange,
		getSortingState,
		isSortedBy,
		getSortOrder,
		clearSort,
		setSorting,
	};
}
