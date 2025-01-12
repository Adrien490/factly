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
	if (count === 0) return null;

	return (
		<div className="mb-4">
			<div className="pl-2 flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
						<CheckSquare className="h-4 w-4 text-primary" />
					</div>
					<div className="flex flex-col gap-0.5">
						<span className="text-sm font-medium">
							{count}{" "}
							{count > 1 ? "éléments sélectionnés" : "élément sélectionné"}
						</span>
						{actions && (
							<span className="text-[13px] text-muted-foreground">
								Actions disponibles
							</span>
						)}
					</div>
				</div>
				{actions && <div className="flex items-center gap-2">{actions}</div>}
			</div>
		</div>
	);
}
