"use client";

import { Textarea } from "@/shared/components/ui/textarea";
import { FieldInfo } from "..";
import { FormLabel } from "../ui";
import { useFieldContext } from "./form-context";

interface TextareaFieldProps {
	disabled?: boolean;
	label?: string;
	placeholder?: string;
	required?: boolean;
	rows?: number;
}

export const TextareaField = ({
	disabled,
	label,
	placeholder,
	required,
	rows = 4,
}: TextareaFieldProps) => {
	const field = useFieldContext<string>();

	return (
		<div className="space-y-1.5">
			<FormLabel htmlFor={field.name} className="flex items-center">
				{label}
				{required && <span className="text-destructive ml-1">*</span>}
			</FormLabel>
			<Textarea
				disabled={disabled}
				name={field.name}
				placeholder={placeholder}
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.value)}
				rows={rows}
				className="border-input focus:ring-1 focus:ring-primary"
			/>
			<FieldInfo field={field} />
		</div>
	);
};
