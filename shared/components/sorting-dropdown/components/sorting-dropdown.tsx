"use client";

import useSorting, {
	SortDirection,
} from "@/shared/components/datatable/hooks/use-sorting";
import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { Filter, SlidersHorizontal } from "lucide-react";
import * as React from "react";
import { FilterOption } from "../types";

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
	const { isPending, column, direction, sortBy, setDirection } = useSorting();

	const handleSelect = (newValue: string) => {
		if (paramName === "sortBy") {
			sortBy(newValue);
		} else if (paramName === "sortOrder") {
			setDirection(newValue as SortDirection);
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
					className={cn(
						"h-8 gap-2",
						currentOption && "bg-accent text-accent-foreground",
						buttonClassName
					)}
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
					{options.map((option) => {
						const isSelected =
							paramName === "sortBy"
								? option.value === column
								: option.value === direction;

						return (
							<DropdownMenuItem
								key={option.value}
								onSelect={() => handleSelect(option.value)}
								className={cn(
									"flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
									isSelected && "bg-accent text-accent-foreground"
								)}
							>
								{option.icon}
								<span className="flex-1 truncate">{option.label}</span>
								{isSelected && paramName === "sortBy" && (
									<span className="ml-2 text-xs text-muted-foreground">
										{direction === "asc" ? "↑" : "↓"}
									</span>
								)}
							</DropdownMenuItem>
						);
					})}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
