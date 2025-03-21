"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToggleView } from "@/features/toggle-view/hooks/use-toggle-view";
import ViewType, {
	ToggleViewProps,
} from "@/features/toggle-view/types/view-type";
import { LayoutGrid, List } from "lucide-react";

/**
 * Composant pour basculer entre différentes vues (grille/liste)
 * Utilise le hook useViewSwitcher pour gérer la logique
 */
export function ViewSwitcher({ className }: ToggleViewProps) {
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

export default ViewSwitcher;
