"use client";

import { Button } from "@/shared/components";
import {
	Card,
	CardContent,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/components/ui";
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
	const hasSelection = selectedCount > 0;
	const selectionText = hasSelection
		? `${selectedCount} ${
				selectedCount > 1 ? "éléments sélectionnés" : "élément sélectionné"
		  }`
		: "Aucune sélection";

	return (
		<Card
			role="region"
			aria-live="polite"
			aria-label="Barre d'outils de sélection"
		>
			<CardContent
				className={`flex items-center justify-between py-2 border-b transition-colors duration-200 ${
					hasSelection ? "bg-primary/5 border-b-primary/20" : "bg-background"
				}`}
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
						{selectionText}
					</span>
					{hasSelection && (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										onClick={clearSelection}
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

				<div className="flex items-center gap-2 h-8">
					{hasSelection && !children && (
						<span className="text-sm text-muted-foreground italic">
							Utilisez les actions ci-dessous pour traiter la sélection
						</span>
					)}
					{children}
				</div>
			</CardContent>
		</Card>
	);
}
