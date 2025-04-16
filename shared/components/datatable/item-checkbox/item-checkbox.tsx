"use client";

import { Checkbox } from "@/shared/components";
import { useSelectionContext } from "@/shared/contexts";
import { ItemCheckboxProps } from "./types";

export function ItemCheckbox({
	itemId,
	disabled = false,
	className,
}: ItemCheckboxProps) {
	const { isSelected, handleItemSelectionChange, isPending } =
		useSelectionContext();

	return (
		<Checkbox
			checked={isSelected(itemId)}
			onCheckedChange={(checked) =>
				handleItemSelectionChange(itemId, !!checked)
			}
			aria-disabled={disabled || isPending}
			className={className}
			aria-label="Sélectionner cet élément"
		/>
	);
}
