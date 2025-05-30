"use client";

import { ViewType } from "@/shared/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";

/**
 * Hook personnalisé pour gérer la fonctionnalité de changement de vue (grid/list)
 *
 * @returns Un objet contenant la vue actuelle, la vue optimistique, un indicateur de chargement et la fonction de changement de vue
 */
export function useViewToggle() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Récupérer la vue active depuis l'URL ou utiliser 'grid' par défaut
	const initialView = (searchParams.get("view") as ViewType) || "grid";

	// Utiliser useOptimistic pour mettre à jour instantanément l'UI
	const [optimisticView, updateOptimisticView] = useOptimistic(
		initialView,
		(state, newView: ViewType) => newView
	);

	// Mettre à jour l'URL quand l'utilisateur change de vue
	const handleViewChange = (view: ViewType) => {
		// Mettre à jour immédiatement l'interface utilisateur
		startTransition(() => {
			updateOptimisticView(view);
		});

		// Créer une nouvelle instance de URLSearchParams basée sur les paramètres actuels
		const params = new URLSearchParams(searchParams.toString());

		// Mettre à jour ou ajouter le paramètre 'view'
		params.set("view", view);

		// Mise à jour de l'URL avec le nouveau paramètre sans rechargement de la page
		startTransition(() => {
			router.replace(`?${params.toString()}`, { scroll: false });
		});
	};

	return {
		currentView: initialView,
		optimisticView,
		isPending,
		handleViewChange,
	};
}
