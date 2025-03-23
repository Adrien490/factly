"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/shared/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/shared/components/ui/popover";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";
import useFilterSelect from "./hooks/use-filter-select";

export type FilterOption = {
	value: string;
	label: string;
};

interface FilterSelectProps {
	filterKey: string;
	label: string;
	options: FilterOption[];
	placeholder?: string;
	multiple?: boolean;
	className?: string;
	maxHeight?: number;
}

export function FilterSelect({
	filterKey,
	label,
	options,
	placeholder = "Sélectionner...",
	multiple = false,
	className,
	maxHeight = 250,
}: FilterSelectProps) {
	const { values, setFilter, clearFilter, isSelected, isPending } =
		useFilterSelect(filterKey);
	const [open, setOpen] = useState(false);

	// Gestion des options sélectionnées
	const selected = options.filter((option) => values.includes(option.value));

	// Gérer le changement de valeur pour select simple
	const handleSingleSelect = (value: string) => {
		setFilter(value);
	};

	// Gérer le changement de valeur pour select multiple
	const handleMultipleSelect = (option: FilterOption) => {
		if (isSelected(option.value)) {
			setFilter(values.filter((value) => value !== option.value));
		} else {
			setFilter([...values, option.value]);
		}
	};

	// Rendu du select simple
	if (!multiple) {
		return (
			<div
				data-pending={isPending ? "" : undefined}
				className={cn("min-w-[180px]", className)}
			>
				<Select value={values[0] || ""} onValueChange={handleSingleSelect}>
					<SelectTrigger className="w-full">
						<span className="text-muted-foreground text-xs mr-2">{label}</span>
						<SelectValue placeholder={placeholder} />
					</SelectTrigger>
					<SelectContent>
						<ScrollArea className={`h-${maxHeight}`}>
							{options.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</ScrollArea>
					</SelectContent>
				</Select>
			</div>
		);
	}

	// Rendu du select multiple
	return (
		<div
			data-pending={isPending ? "" : undefined}
			className={cn("min-w-[220px] max-w-[300px]", className)}
		>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between relative"
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
								{selected.length === 0 ? (
									<span className="text-muted-foreground truncate">
										{placeholder}
									</span>
								) : (
									<div className="flex flex-nowrap gap-1 max-w-full overflow-x-auto hide-scrollbar">
										{selected.map((option) => (
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
										onSelect={() => handleMultipleSelect(option)}
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
