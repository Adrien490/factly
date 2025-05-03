"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { FieldInfo } from "..";
import { FormLabel } from "../ui";
import { useFieldContext } from "./form-context";

interface SelectFieldProps<T extends string> {
	disabled?: boolean;
	label?: string;
	placeholder?: string;
	required?: boolean;
	options: { value: T; label: string }[];
}

export const SelectField = <T extends string>({
	disabled,
	label,
	placeholder,
	required,
	options,
}: SelectFieldProps<T>) => {
	const field = useFieldContext<string>();

	return (
		<div className="space-y-1.5">
			<FormLabel htmlFor={field.name} className="flex items-center">
				{label}
				{required && <span className="text-destructive ml-1">*</span>}
			</FormLabel>
			<Select
				name={field.name}
				disabled={disabled}
				value={field.state.value}
				onValueChange={(value) => field.handleChange(value as T)}
			>
				<SelectTrigger
					id={field.name}
					className="w-full"
					onBlur={field.handleBlur}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent className="max-h-[300px] overflow-y-auto">
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<FieldInfo field={field} />
		</div>
	);
};
