"use client";

import { Button } from "@/shared/components/shadcn-ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/shadcn-ui/dropdown-menu";
import { ArrowDown, ArrowUp, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useSortingOptions } from "./hooks";

/**
 * Dropdown compact pour sélectionner les options de tri
 * Utilise useSortingOptions pour une gestion optimisée
 */
export function SortingOptionsDropdown({
	sortFields,
	defaultSortBy = "createdAt",
	defaultSortOrder = "desc",
}: {
	sortFields: Array<{ label: string; value: string; icon: React.ReactNode }>;
	defaultSortBy?: string;
	defaultSortOrder?: "asc" | "desc";
}) {
	const {
		currentSortBy,
		currentSortOrder,
		isPending,
		toggleSortOrder,
		resetSort,
		currentField,
	} = useSortingOptions(sortFields, defaultSortBy, defaultSortOrder);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="h-10 gap-2"
					disabled={isPending}
					data-pending={isPending ? "true" : undefined}
				>
					<SlidersHorizontal
						className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
					/>
					<span>
						Tri: {currentField?.label || "Date"}{" "}
						{currentSortOrder === "asc" ? "↑" : "↓"}
					</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				data-pending={isPending ? "true" : undefined}
				align="start"
				className="w-56"
			>
				<DropdownMenuLabel>Trier par</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuSeparator />

				{sortFields.map((field) => (
					<DropdownMenuItem
						key={field.value}
						className="flex items-center gap-2 px-2 py-1.5"
						onClick={() => toggleSortOrder(field.value)}
					>
						{field.icon}
						<span className="flex-1">{field.label}</span>
						{currentSortBy === field.value ? (
							currentSortOrder === "asc" ? (
								<ArrowUp className="h-4 w-4 text-primary" />
							) : (
								<ArrowDown className="h-4 w-4 text-primary" />
							)
						) : (
							<div className="h-4 w-4 opacity-50 flex items-center">
								<ArrowDown className="h-3 w-3" />
							</div>
						)}
					</DropdownMenuItem>
				))}

				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground"
					onClick={resetSort}
				>
					<RotateCcw className="h-4 w-4" />
					<span>Réinitialiser le tri</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
