"use client";

import { Textarea } from "@/shared/components/ui/textarea";
import { FieldInfo } from "..";
import { useFieldContext } from "../../lib/form-context";
import { FormLabel } from "../ui";

interface TextareaFieldProps extends React.ComponentProps<"textarea"> {
	label?: string;
}

export const TextareaField = ({
	disabled,
	label,
	rows,
	placeholder,
	required,
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
