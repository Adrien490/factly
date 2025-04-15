"use client";

import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ViewType } from "@/shared/types/view-type";
import { LayoutGrid, List } from "lucide-react";
import { useViewToggle } from "./hooks";

/**
 * Composant pour basculer entre différentes vues (grille/liste)
 * Utilise le hook useToggleView pour gérer la logique
 */

export function ViewToggle() {
	const { optimisticView, isPending, handleViewChange } = useViewToggle();

	return (
		<Tabs
			data-pending={isPending ? "" : undefined}
			value={optimisticView}
			onValueChange={(value) => handleViewChange(value as ViewType)}
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
