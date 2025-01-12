"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";

export function useSelection(selectionKey: string = "selected") {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const selectedItems = searchParams.getAll(selectionKey);
	const [optimisticSelection, setOptimisticSelection] =
		useOptimistic<string[]>(selectedItems);

	const updateUrlWithParams = (
		params: URLSearchParams,
		newSelection: string[]
	) => {
		startTransition(() => {
			setOptimisticSelection(newSelection);
			router.push(`?${params.toString()}`, { scroll: false });
		});
	};

	const preserveExistingParams = () => {
		const params = new URLSearchParams(searchParams);
		const existingParams = {
			page: Number(params.get("page")) || 1,
			perPage: Number(params.get("perPage")) || 10,
			search: params.get("search") || undefined,
		};

		// Préserver les filtres existants
		const filters: Record<string, string> = {};
		params.forEach((value, key) => {
			if (key.startsWith("filter_")) {
				filters[key.replace("filter_", "")] = value;
			}
		});

		return { params, existingParams, filters };
	};

	const handleSelectionChange = (selection: string[], checked: boolean) => {
		const { params } = preserveExistingParams();

		// Supprimer d'abord tous les paramètres de sélection
		params.delete(selectionKey);

		if (checked) {
			// Si on sélectionne tout, on ajoute les nouveaux éléments aux éléments déjà sélectionnés
			const newSelection = [...new Set([...optimisticSelection, ...selection])];
			newSelection.forEach((id) => params.append(selectionKey, id));
			updateUrlWithParams(params, newSelection);
		} else {
			// Si on désélectionne, on retire uniquement les éléments de la page courante
			const newSelection = optimisticSelection.filter(
				(id) => !selection.includes(id)
			);
			newSelection.forEach((id) => params.append(selectionKey, id));
			updateUrlWithParams(params, newSelection);
		}
	};

	const handleItemSelectionChange = (itemId: string, checked: boolean) => {
		const { params } = preserveExistingParams();

		// Supprimer d'abord tous les paramètres de sélection
		params.delete(selectionKey);

		const newSelection = checked
			? [...optimisticSelection, itemId]
			: optimisticSelection.filter((id) => id !== itemId);

		newSelection.forEach((id) => params.append(selectionKey, id));
		updateUrlWithParams(params, newSelection);
	};

	const clearSelection = () => {
		const { params } = preserveExistingParams();
		params.delete(selectionKey);
		updateUrlWithParams(params, []);
	};

	const getSelectedCount = () => optimisticSelection.length;

	const isSelected = (itemId: string) => optimisticSelection.includes(itemId);

	const areAllSelected = (items: string[]) =>
		items.length > 0 &&
		items.every((item) => optimisticSelection.includes(item));

	return {
		isPending,
		selectedItems: optimisticSelection,
		handleSelectionChange,
		handleItemSelectionChange,
		clearSelection,
		getSelectedCount,
		isSelected,
		areAllSelected,
	};
}
