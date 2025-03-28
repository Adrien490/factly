"use client";

import { ScrollArea } from "@/features/shared/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/features/shared/components/ui/select";
import { cn } from "@/features/shared/lib/utils";
import useFilterSelect from "../hooks/use-filter-select";

export type FilterOption = {
	value: string;
	label: string;
};

interface FilterSelectProps {
	filterKey: string;
	label: string;
	options: FilterOption[];
	placeholder?: string;
	className?: string;
	maxHeight?: number;
}

export function FilterSelect({
	filterKey,
	label,
	options,
	placeholder = "Sélectionner...",
	className,
	maxHeight = 250,
}: FilterSelectProps) {
	const { value, setFilter, isPending } = useFilterSelect(filterKey);

	// Gérer le changement de valeur pour select simple
	const handleSingleSelect = (value: string) => {
		setFilter(value);
	};

	return (
		<div
			data-pending={isPending ? "" : undefined}
			className={cn("min-w-[180px] relative", className)}
		>
			<Select
				value={value || ""}
				onValueChange={handleSingleSelect}
				disabled={isPending}
			>
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
