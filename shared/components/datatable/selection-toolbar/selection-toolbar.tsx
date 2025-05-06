"use client";

import { Button } from "@/shared/components";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/components/ui";
import { useSelectionContext } from "@/shared/contexts";
import { CheckSquare, X } from "lucide-react";
import { ReactNode } from "react";

interface SelectionToolbarProps {
	children: ReactNode;
}

export function SelectionToolbar({ children }: SelectionToolbarProps) {
	const { selectedItems, handleSelectionChange } = useSelectionContext();
	const hasSelection = selectedItems.length > 0;

	if (selectedItems.length === 0) {
		return null;
	}

	return (
		<div
			className={`flex items-center justify-between px-3 py-2 border-b transition-colors duration-200 ${
				hasSelection ? "bg-primary/5 border-b-primary/20" : "bg-background"
			}`}
			role="region"
			aria-live="polite"
			aria-label="Barre d'outils de sélection"
		>
			<div className="flex items-center gap-2 h-8">
				<CheckSquare
					className={`h-4 w-4 ${
						hasSelection ? "text-primary" : "text-muted-foreground"
					}`}
					aria-hidden="true"
				/>
				<span
					className={`text-sm ${
						hasSelection ? "font-medium" : "text-muted-foreground"
					}`}
				>
					{selectedItems.length} élément(s) sélectionné(s)
				</span>
				{hasSelection && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleSelectionChange([], false)}
									className="h-7 px-2 text-xs transition-colors hover:bg-destructive/10 hover:text-destructive"
									aria-label="Effacer la sélection"
								>
									<X className="h-3.5 w-3.5 mr-1" />
									Effacer
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>Effacer la sélection actuelle</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
			{hasSelection && (
				<div className="flex items-center gap-2 h-8">
					<span className="text-sm text-muted-foreground italic">
						Utilisez les actions ci-dessous pour traiter la sélection
					</span>

					{children}
				</div>
			)}
		</div>
	);
}
