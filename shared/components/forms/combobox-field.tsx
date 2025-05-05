"use client";

import { Button } from "@/shared/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/shared/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { FieldInfo } from "..";
import { useFieldContext } from "../../lib/form-context";
import { FormLabel } from "../ui";

interface ComboboxFieldProps<T extends string> {
	disabled?: boolean;
	label?: string;
	placeholder?: string;
	required?: boolean;
	options: { value: T; label: string }[];
	searchPlaceholder?: string;
	emptyMessage?: string;
	className?: string;
}

export const ComboboxField = <T extends string>({
	disabled,
	label,
	placeholder,
	required,
	options,
	searchPlaceholder = "Rechercher...",
	emptyMessage = "Aucun résultat.",
	className,
}: ComboboxFieldProps<T>) => {
	const field = useFieldContext<string>();
	const [open, setOpen] = React.useState(false);

	return (
		<div className="space-y-1.5">
			<FormLabel htmlFor={field.name} className="flex items-center">
				{label}
				{required && <span className="text-destructive ml-1">*</span>}
			</FormLabel>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className={cn("w-full justify-between", className)}
						onClick={() => setOpen(!open)}
						disabled={disabled}
						onBlur={field.handleBlur}
						id={field.name}
					>
						{field.state.value
							? options.find((option) => option.value === field.state.value)
									?.label
							: placeholder}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0">
					<Command>
						<CommandInput placeholder={searchPlaceholder} className="h-9" />
						<CommandList>
							<CommandEmpty>{emptyMessage}</CommandEmpty>
							<CommandGroup>
								{options.map((option) => (
									<CommandItem
										key={option.value}
										value={option.value}
										onSelect={(currentValue) => {
											field.handleChange(
												currentValue === field.state.value
													? ""
													: (currentValue as T)
											);
											setOpen(false);
										}}
									>
										{option.label}
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												field.state.value === option.value
													? "opacity-100"
													: "opacity-0"
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<FieldInfo field={field} />
		</div>
	);
};
