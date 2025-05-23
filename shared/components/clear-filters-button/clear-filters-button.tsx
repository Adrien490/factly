"use client";

import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ClearFiltersButtonProps } from "./types";

export function ClearFiltersButton({
	filters,
	label = "Effacer les filtres",
	prefix = "",
	onClear,
	excludeFilters = [],
	...buttonProps
}: ClearFiltersButtonProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Vérifier si l'un des filtres a des valeurs
	const hasActiveFilters = filters.some((filter) => {
		const paramKey = prefix ? `${prefix}${filter}` : filter;
		return searchParams.has(paramKey);
	});

	// Si aucun filtre n'est actif, ne pas afficher le bouton
	if (!hasActiveFilters) {
		return null;
	}

	// Fonction pour supprimer tous les filtres
	const handleClearAll = () => {
		// Créer une nouvelle instance de URLSearchParams
		const params = new URLSearchParams(searchParams);

		// Supprimer chaque filtre
		filters.forEach((filter) => {
			const paramKey = prefix ? `${prefix}${filter}` : filter;
			if (!excludeFilters.includes(filter)) {
				params.delete(paramKey);
			}
		});

		// Réinitialiser également la pagination
		params.set("page", "1");

		// Mettre à jour l'URL
		startTransition(() => {
			router.push(`?${params.toString()}`, { scroll: false });
			if (onClear) onClear();
		});
	};

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={handleClearAll}
			className="gap-1.5"
			disabled={isPending}
			{...buttonProps}
		>
			<X className="h-4 w-4" />
			{label}
		</Button>
	);
}
