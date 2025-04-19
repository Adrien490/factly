"use client";

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components";
import { cn } from "@/shared/utils";
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
	className = "",
}: {
	sortFields: Array<{ label: string; value: string; icon: React.ReactNode }>;
	defaultSortBy?: string;
	defaultSortOrder?: "asc" | "desc";
	className?: string;
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
					className={cn("gap-2", className)}
					disabled={isPending}
					data-pending={isPending ? "true" : undefined}
				>
					<SlidersHorizontal
						className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
					/>
					<span className="truncate overflow-hidden text-ellipsis">
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
