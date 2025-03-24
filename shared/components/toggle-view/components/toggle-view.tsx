"use client";

import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import { LayoutGrid, List } from "lucide-react";
import useToggleView from "../hooks/use-toggle-view";
import { ViewType } from "../types";

/**
 * Composant pour basculer entre différentes vues (grille/liste)
 * Utilise le hook useToggleView pour gérer la logique
 */

export interface ToggleViewProps {
	/** Classe CSS optionnelle pour le composant */
	className?: string;
}
export function ToggleView({ className }: ToggleViewProps) {
	const { optimisticView, isPending, handleViewChange } = useToggleView();

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
