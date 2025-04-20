"use client";

import { Button } from "@/shared/components";
import { CheckSquare, X } from "lucide-react";

type Props = {
	children?: React.ReactNode;
	selectedCount: number;
	clearSelection: () => void;
};

export function SelectionToolbar({
	children,
	selectedCount,
	clearSelection,
}: Props) {
	return (
		<div className="flex items-center justify-between px-3 py-2 bg-background border-b border-b-slate-200 dark:border-b-slate-700">
			<div className="flex items-center gap-2 h-8">
				<CheckSquare
					className={`h-4 w-4 ${
						selectedCount > 0 ? "text-primary" : "text-muted-foreground"
					}`}
				/>
				<span
					className={`text-sm ${
						selectedCount > 0 ? "font-medium" : "text-muted-foreground"
					}`}
				>
					{selectedCount > 0
						? `${selectedCount} ${
								selectedCount > 1
									? "éléments sélectionnés"
									: "élément sélectionné"
						  }`
						: "Aucune sélection"}
				</span>
				{selectedCount > 0 && (
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

			<div className="flex items-center h-8">{children}</div>
		</div>
	);
}
