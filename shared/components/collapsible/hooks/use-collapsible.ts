"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";

export interface CollapsibleState {
	[key: string]: boolean;
}

export function useCollapsible(collapsibleKey: string = "expanded") {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const expandedItems = searchParams.getAll(collapsibleKey);
	const [optimisticExpanded, setOptimisticExpanded] =
		useOptimistic<string[]>(expandedItems);

	const updateUrlWithParams = (
		params: URLSearchParams,
		newExpanded: string[]
	) => {
		startTransition(() => {
			setOptimisticExpanded(newExpanded);
			router.push(`?${params.toString()}`, { scroll: false });
		});
	};

	const preserveExistingParams = () => {
		const params = new URLSearchParams(searchParams);

		// Préserver les paramètres de pagination
		const existingParams = {
			page: Number(params.get("page")) || 1,
			perPage: Number(params.get("perPage")) || 10,
			search: params.get("search") || undefined,
			sortBy: params.get("sortBy") || undefined,
			sortOrder: params.get("sortOrder") || undefined,
		};

		// Préserver les paramètres de sélection
		const selectedItems = params.getAll("selected");

		// Préserver les filtres existants
		const filters: Record<string, string> = {};
		params.forEach((value, key) => {
			if (key.startsWith("filter_")) {
				filters[key.replace("filter_", "")] = value;
			}
		});

		return { params, existingParams, filters, selectedItems };
	};

	const toggleRowExpanded = (rowId: string) => {
		const { params } = preserveExistingParams();

		// Supprimer d'abord tous les paramètres de collapsible
		params.delete(collapsibleKey);

		// Vérifier si la ligne est déjà étendue
		const isExpanded = optimisticExpanded.includes(rowId);

		let newExpanded: string[];

		if (isExpanded) {
			// Si elle est étendue, on la retire
			newExpanded = optimisticExpanded.filter((id) => id !== rowId);
		} else {
			// Si elle n'est pas étendue, on l'ajoute
			newExpanded = [...optimisticExpanded, rowId];
		}

		// Mettre à jour les paramètres d'URL
		newExpanded.forEach((id) => params.append(collapsibleKey, id));
		updateUrlWithParams(params, newExpanded);
	};

	const expandRow = (rowId: string) => {
		const { params } = preserveExistingParams();

		// Ne rien faire si la ligne est déjà étendue
		if (optimisticExpanded.includes(rowId)) {
			return;
		}

		// Supprimer d'abord tous les paramètres de collapsible
		params.delete(collapsibleKey);

		// Ajouter la ligne aux lignes étendues
		const newExpanded = [...optimisticExpanded, rowId];
		newExpanded.forEach((id) => params.append(collapsibleKey, id));
		updateUrlWithParams(params, newExpanded);
	};

	const collapseRow = (rowId: string) => {
		const { params } = preserveExistingParams();

		// Ne rien faire si la ligne n'est pas étendue
		if (!optimisticExpanded.includes(rowId)) {
			return;
		}

		// Supprimer d'abord tous les paramètres de collapsible
		params.delete(collapsibleKey);

		// Retirer la ligne des lignes étendues
		const newExpanded = optimisticExpanded.filter((id) => id !== rowId);
		newExpanded.forEach((id) => params.append(collapsibleKey, id));
		updateUrlWithParams(params, newExpanded);
	};

	const expandAllRows = (rowIds: string[]) => {
		const { params } = preserveExistingParams();

		// Supprimer d'abord tous les paramètres de collapsible
		params.delete(collapsibleKey);

		// Ajouter toutes les lignes aux lignes étendues
		const newExpanded = [...new Set([...optimisticExpanded, ...rowIds])];
		newExpanded.forEach((id) => params.append(collapsibleKey, id));
		updateUrlWithParams(params, newExpanded);
	};

	const collapseAllRows = () => {
		const { params } = preserveExistingParams();

		// Supprimer tous les paramètres de collapsible
		params.delete(collapsibleKey);
		updateUrlWithParams(params, []);
	};

	const isRowExpanded = (rowId: string) => optimisticExpanded.includes(rowId);

	return {
		isPending,
		expandedItems: optimisticExpanded,
		toggleRowExpanded,
		expandRow,
		collapseRow,
		expandAllRows,
		collapseAllRows,
		isRowExpanded,
	};
}
