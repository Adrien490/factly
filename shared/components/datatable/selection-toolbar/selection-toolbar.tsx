"use client";

import { Button } from "@/shared/components";
import { useSelectionContext } from "@/shared/contexts";
import { CheckSquare, X } from "lucide-react";

type Props = {
	actions?: React.ReactNode;
};

export function SelectionToolbar({ actions }: Props) {
	const { getSelectedCount, clearSelection } = useSelectionContext();
	const selectedCount = getSelectedCount();
	const hasSelection = selectedCount > 0;

	return (
		<div className="flex items-center justify-between px-3 py-2 bg-background border-b border-b-slate-200 dark:border-b-slate-700">
			<div className="flex items-center gap-2 h-8">
				<CheckSquare
					className={`h-4 w-4 ${
						hasSelection ? "text-primary" : "text-muted-foreground"
					}`}
				/>
				<span
					className={`text-sm ${
						hasSelection ? "font-medium" : "text-muted-foreground"
					}`}
				>
					{hasSelection
						? `${selectedCount} ${
								selectedCount > 1
									? "éléments sélectionnés"
									: "élément sélectionné"
						  }`
						: "Aucune sélection"}
				</span>
				{hasSelection && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearSelection}
						className="h-7 px-2 text-xs"
					>
						<X className="h-3.5 w-3.5 mr-1" />
						Effacer
					</Button>
				)}
			</div>

			<div className="flex items-center h-8">
				{hasSelection && actions ? actions : <div className="w-px h-px" />}
			</div>
		</div>
	);
}
