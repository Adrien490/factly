"use client";

import { Checkbox } from "@/shared/components/ui/checkbox";
import { useFilter } from "@/shared/hooks/use-filter";
import { CheckboxFilterProps } from "./types";

export function CheckboxFilter({
	filterKey,
	value,
	id,
	className,
}: CheckboxFilterProps) {
	const { toggleFilter, isSelected, isPending } = useFilter(filterKey);
	const checkboxId = id || `${filterKey}-${value}`;

	return (
		<Checkbox
			id={checkboxId}
			checked={isSelected(value)}
			onCheckedChange={() => toggleFilter(value)}
			className={className}
			data-pending={isPending ? "" : undefined}
		/>
	);
}
