import { Input } from "@/shared/components/ui/input";
import { FieldInfo } from "..";
import { useFieldContext } from "../../lib/form-context";
import { FormLabel } from "../ui";

interface HTMLInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
}

export const InputField = ({
	disabled,
	label,
	placeholder,
	required,
	type,
	min,
	step,
	value,
}: HTMLInputProps) => {
	const field = useFieldContext<string>();

	return (
		<div className="space-y-1.5">
			<FormLabel htmlFor="name" className="flex items-center">
				{label}
				{required && <span className="text-destructive ml-1">*</span>}
			</FormLabel>
			<Input
				min={min}
				step={step}
				type={type}
				disabled={disabled}
				name={field.name}
				placeholder={placeholder}
				value={value ?? field.state.value}
				onChange={(e) => field.handleChange(e.target.value)}
				className="border-input focus:ring-1 focus:ring-primary"
			/>
			<FieldInfo field={field} />
		</div>
	);
};
