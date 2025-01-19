"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSorting } from "@/hooks/use-sorting";
import { cn } from "@/lib/utils";
import { Filter, SlidersHorizontal } from "lucide-react";
import * as React from "react";

interface FilterOption {
	label: string;
	value: string;
	icon?: React.ReactNode;
}

interface SortingDropdownProps {
	label?: string;
	options: FilterOption[];
	/** Nom du paramètre dans l'URL */
	paramName: "sortBy" | "sortOrder";
	/** Classes CSS pour le bouton */
	buttonClassName?: string;
	/** Icône du bouton */
	icon?: React.ReactNode;
}

export function SortingDropdown({
	label = "Filtrer par",
	options,
	paramName,
	buttonClassName,
	icon = <SlidersHorizontal className="h-4 w-4" />,
}: SortingDropdownProps) {
	const { isPending, setSorting, clearSort, getSortingState } = useSorting();
	const { column, direction } = getSortingState();

	const handleSelect = (newValue: string) => {
		// Si on clique sur la valeur déjà sélectionnée, on la désélectionne
		if (
			(paramName === "sortBy" && newValue === column) ||
			(paramName === "sortOrder" && newValue === direction)
		) {
			clearSort();
			return;
		}

		if (paramName === "sortBy") {
			setSorting(newValue, direction || "asc");
		} else if (paramName === "sortOrder" && column) {
			setSorting(column, newValue as "asc" | "desc");
		}
	};

	const currentOption = options.find((option) => {
		if (paramName === "sortBy") {
			return option.value === column;
		}
		return option.value === direction;
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					data-pending={isPending ? "pending" : undefined}
					variant="outline"
					className={cn("h-8 gap-2", buttonClassName)}
				>
					{isPending ? <Filter className="h-4 w-4 animate-pulse" /> : icon}
					<span>
						{currentOption ? `${label}: ${currentOption.label}` : label}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-48">
				<DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
					{label}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<div className="max-h-[300px] overflow-y-auto">
					{options.map((option) => (
						<DropdownMenuItem
							key={option.value}
							onSelect={() => handleSelect(option.value)}
							className={cn(
								"flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
								(paramName === "sortBy"
									? option.value === column
									: option.value === direction) &&
									"bg-accent text-accent-foreground"
							)}
						>
							{option.icon}
							<span className="flex-1 truncate">{option.label}</span>
						</DropdownMenuItem>
					))}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
