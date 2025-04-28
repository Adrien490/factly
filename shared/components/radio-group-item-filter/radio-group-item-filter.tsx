"use client";

import { RadioGroupItem } from "@/shared/components/ui/radio-group";
import { useFilter } from "@/shared/hooks/use-filter";
import { cn } from "@/shared/utils";
import { RadioGroupItemFilterProps } from "./types";

export function RadioGroupItemFilter({
	filterKey,
	value,
	id,
	className,
}: RadioGroupItemFilterProps) {
	const { setFilter, values, isPending } = useFilter(filterKey);
	const currentValue = values[0] || ""; // Radio est à sélection unique
	const radioId = id || `${filterKey}-${value}`;

	return (
		<RadioGroupItem
			id={radioId}
			value={value}
			checked={currentValue === value}
			onClick={() => setFilter(value === currentValue ? null : value)}
			className={cn(className)}
			data-pending={isPending ? "" : undefined}
		/>
	);
}
