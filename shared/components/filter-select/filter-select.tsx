"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components";
import { ScrollArea } from "@/shared/components/shadcn-ui/scroll-area";
import { cn } from "@/shared/utils";
import { useFilterSelect } from "./hooks/use-filter-select";
import { FilterSelectProps } from "./types";

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
				<SelectTrigger>
					<span className="text-muted-foreground text-xs mr-2">{label}</span>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<ScrollArea className={`h-${maxHeight}`}>
						<SelectItem value="all">Tout</SelectItem>
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
