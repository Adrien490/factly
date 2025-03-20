"use client";

import { CheckSquare } from "lucide-react";

type Props = {
	selectedItems?: string[];
	actions?: React.ReactNode;
};

export default function SelectionToolbar({
	selectedItems = [],
	actions,
}: Props) {
	const count = selectedItems.length;
	const hasSelection = count > 0;

	return (
		<div
			className={`mb-4 bg-muted/20 rounded-md p-2 flex items-center justify-between ${
				hasSelection ? "bg-muted/10" : "bg-transparent"
			}`}
		>
			<div className="flex items-center gap-2 h-8">
				<CheckSquare
					className={`h-4 w-4 ${
						hasSelection ? "text-primary" : "text-muted-foreground/30"
					}`}
				/>
				<span
					className={`text-sm ${
						hasSelection ? "font-medium" : "text-muted-foreground/50"
					}`}
				>
					{hasSelection
						? `${count} ${
								count > 1 ? "éléments sélectionnés" : "élément sélectionné"
						  }`
						: "Aucune sélection"}
				</span>
			</div>

			<div className="flex items-center h-8">
				{hasSelection && actions ? actions : <div className="w-px h-px" />}
			</div>
		</div>
	);
}
