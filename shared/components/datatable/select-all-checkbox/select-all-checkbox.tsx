"use client";

import { Checkbox } from "@/shared/components";
import { useSelectionContext } from "@/shared/contexts";
import { SelectAllCheckboxProps } from "./types";

export function SelectAllCheckbox({
	itemIds,
	disabled = false,
	className,
}: SelectAllCheckboxProps) {
	const { areAllSelected, handleSelectionChange, isPending } =
		useSelectionContext();
	const allSelected = areAllSelected(itemIds);

	return (
		<Checkbox
			checked={allSelected}
			onCheckedChange={(checked) => handleSelectionChange(itemIds, !!checked)}
			aria-disabled={disabled || isPending}
			className={className}
			aria-label={allSelected ? "Tout désélectionner" : "Tout sélectionner"}
		/>
	);
}
