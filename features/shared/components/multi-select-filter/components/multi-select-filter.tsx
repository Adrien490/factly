"use client";

import { Loader } from "@/features/shared/components/loader";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/features/shared/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/features/shared/components/ui/popover";
import { ScrollArea } from "@/features/shared/components/ui/scroll-area";
import { cn } from "@/features/shared/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";
import useMultiSelectFilter from "../hooks/use-multi-select-filter";
import { MultiSelectFilterProps } from "../types";

export function MultiSelectFilter({
	filterKey,
	label,
	options,
	placeholder = "Sélectionner...",
	className,
	maxHeight = 250,
}: MultiSelectFilterProps) {
	const { values, setFilter, toggleValue, clearFilter, isSelected, isPending } =
		useMultiSelectFilter(filterKey);
	const [open, setOpen] = useState(false);

	// Gestion des options sélectionnées
	const selectedOptions = options.filter((option) => isSelected(option.value));

	return (
		<div
			data-pending={isPending ? "" : undefined}
			className={cn("min-w-[220px] max-w-[300px] relative", className)}
		>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between relative"
						disabled={isPending}
						onClick={(e) => {
							// Si on clique sur l'icône X, on veut simplement effacer et non ouvrir le popover
							if ((e.target as HTMLElement).closest(".clear-filter-icon")) {
								e.stopPropagation();
								clearFilter();
								return;
							}
						}}
					>
						<div className="flex items-center w-full text-left">
							<span className="text-muted-foreground text-xs font-medium mr-2 flex-shrink-0 min-w-[50px]">
								{label}:
							</span>
							<div className="flex-1 overflow-hidden">
								{selectedOptions.length === 0 ? (
									<span className="text-muted-foreground truncate">
										{placeholder}
									</span>
								) : (
									<div className="flex flex-nowrap gap-1 max-w-full overflow-x-auto hide-scrollbar">
										{selectedOptions.map((option) => (
											<Badge
												key={option.value}
												variant="secondary"
												className="mr-1 truncate max-w-[120px] flex-shrink-0"
											>
												{option.label}
											</Badge>
										))}
									</div>
								)}
							</div>
							<div className="flex items-center gap-1 ml-1 flex-shrink-0">
								{isPending ? (
									<Loader size="xs" variant="spinner" color="primary" />
								) : (
									<>
										{values.length > 0 && (
											<span
												className="clear-filter-icon h-5 w-5 p-0 rounded-full inline-flex items-center justify-center cursor-pointer hover:bg-accent/50"
												onClick={(e) => {
													e.stopPropagation();
													clearFilter();
												}}
											>
												<X className="h-3 w-3" />
											</span>
										)}
										<ChevronsUpDown className="h-4 w-4 opacity-50" />
									</>
								)}
							</div>
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="p-0" align="start">
					<Command>
						<CommandInput placeholder="Rechercher..." />
						<CommandEmpty>Aucun résultat trouvé</CommandEmpty>
						<CommandGroup>
							<ScrollArea className={`h-${maxHeight}`}>
								{options.map((option) => (
									<CommandItem
										key={option.value}
										onSelect={() => toggleValue(option.value)}
										className="cursor-pointer"
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												isSelected(option.value) ? "opacity-100" : "opacity-0"
											)}
										/>
										<span className="truncate">{option.label}</span>
									</CommandItem>
								))}
							</ScrollArea>
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
