import { Checkbox } from "@/shared/components/ui/checkbox";
import { FieldInfo } from "..";
import { useFieldContext } from "../../lib/form-context";
import { FormLabel } from "../ui";

interface CheckboxFieldProps {
	disabled?: boolean;
	label?: string;
	required?: boolean;
}

export const CheckboxField = ({
	disabled,
	label,
	required,
}: CheckboxFieldProps) => {
	const field = useFieldContext<boolean>();

	return (
		<div className="flex items-start space-x-2">
			<Checkbox
				disabled={disabled}
				name={field.name}
				id={field.name}
				checked={field.state.value}
				onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
				className="mt-1"
			/>
			<div className="space-y-1">
				<FormLabel htmlFor={field.name} className="flex items-center">
					{label}
					{required && <span className="text-destructive ml-1">*</span>}
				</FormLabel>
				<FieldInfo field={field} />
			</div>
		</div>
	);
};
