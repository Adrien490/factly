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
import { ArrowDown, ArrowUp, SlidersHorizontal } from "lucide-react";
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
		updateSort,
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

			<DropdownMenuContent align="start" className="w-56">
				<DropdownMenuLabel>Trier par</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{sortFields.map((field) => (
					<div key={field.value}>
						<DropdownMenuItem
							key={`${field.value}-asc`}
							className="flex items-center gap-2 px-2 py-1.5"
							onClick={() => updateSort(field.value, "asc")}
						>
							{field.icon}
							<span className="flex-1">{field.label}</span>
							<ArrowUp
								className={`h-4 w-4 ${
									currentSortBy === field.value && currentSortOrder === "asc"
										? "opacity-100 text-primary"
										: "opacity-50"
								}`}
							/>
						</DropdownMenuItem>

						<DropdownMenuItem
							key={`${field.value}-desc`}
							className="flex items-center gap-2 px-2 py-1.5"
							onClick={() => updateSort(field.value, "desc")}
						>
							{field.icon}
							<span className="flex-1">{field.label}</span>
							<ArrowDown
								className={`h-4 w-4 ${
									currentSortBy === field.value && currentSortOrder === "desc"
										? "opacity-100 text-primary"
										: "opacity-50"
								}`}
							/>
						</DropdownMenuItem>
					</div>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
