import { Input } from "@/shared/components/ui/input";
import { FieldInfo } from "..";
import { useFieldContext } from "../../lib/form-context";
import { FormLabel } from "../ui";

interface InputFieldProps {
	disabled?: boolean;
	label?: string;
	placeholder?: string;
	required?: boolean;
}

export const InputField = ({
	disabled,
	label,
	placeholder,
	required,
}: InputFieldProps) => {
	const field = useFieldContext<string>();

	return (
		<div className="space-y-1.5">
			<FormLabel htmlFor="name" className="flex items-center">
				{label}
				{required && <span className="text-destructive ml-1">*</span>}
			</FormLabel>
			<Input
				disabled={disabled}
				name={field.name}
				placeholder={placeholder}
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.value)}
				className="border-input focus:ring-1 focus:ring-primary"
			/>
			<FieldInfo field={field} />
		</div>
	);
};
