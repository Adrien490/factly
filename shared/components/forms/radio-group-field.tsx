"use client";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { FieldInfo } from "..";
import { useFieldContext } from "../../lib/form-context";

interface RadioOption {
	value: string;
	label: string;
}

interface RadioGroupFieldProps {
	options: RadioOption[];
	label?: string;
	required?: boolean;
	disabled?: boolean;
	onValueChangeCallback?: (value: string) => void;
}

export const RadioGroupField = ({
	options,
	label,
	required,
	disabled,
	onValueChangeCallback,
}: RadioGroupFieldProps) => {
	const field = useFieldContext<string>();

	return (
		<div className="space-y-3">
			{label && (
				<Label className="flex items-center">
					{label}
					{required && <span className="text-destructive ml-1">*</span>}
				</Label>
			)}
			<RadioGroup
				disabled={disabled}
				value={field.state.value}
				onValueChange={(value) => {
					field.handleChange(value);
					onValueChangeCallback?.(value);
				}}
				className="flex gap-4 flex-wrap"
			>
				{options.map((option) => (
					<div key={option.value} className="flex items-center space-x-2">
						<RadioGroupItem value={option.value} id={option.value} />
						<Label htmlFor={option.value}>{option.label}</Label>
					</div>
				))}
			</RadioGroup>
			<FieldInfo field={field} />
		</div>
	);
};
