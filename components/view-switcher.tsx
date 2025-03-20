"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";

type ViewType = "grid" | "list";

interface ViewSwitcherProps {
	className?: string;
}

export default function ViewSwitcher({ className }: ViewSwitcherProps) {
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

	return (
		<Tabs
			data-pending={isPending ? "" : undefined}
			value={optimisticView}
			onValueChange={(value) => handleViewChange(value as ViewType)}
			className={className}
		>
			<TabsList className="grid grid-cols-2 h-9 w-[100px]">
				<TabsTrigger
					value="grid"
					className="flex items-center justify-center px-3"
					data-state={optimisticView === "grid" ? "active" : ""}
				>
					<LayoutGrid className="h-4 w-4" />
				</TabsTrigger>
				<TabsTrigger
					value="list"
					className="flex items-center justify-center px-3"
					data-state={optimisticView === "list" ? "active" : ""}
				>
					<List className="h-4 w-4" />
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
