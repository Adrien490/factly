"use client";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

export interface AutoCompleteOption {
	label: string;
	value: string;
}

interface AutoCompleteProps {
	options: AutoCompleteOption[];
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	emptyMessage?: string;
	className?: string;
	disabled?: boolean;
}

export function AutoComplete({
	options,
	value,
	onValueChange,
	placeholder = "Sélectionner une option...",
	emptyMessage = "Aucun résultat trouvé.",
	className,
	disabled = false,
}: AutoCompleteProps) {
	const [open, setOpen] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState("");

	const selectedOption = React.useMemo(
		() => options.find((option) => option.value === value),
		[options, value]
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn("w-full justify-between", className)}
					disabled={disabled}
				>
					{selectedOption ? selectedOption.label : placeholder}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput
						placeholder="Rechercher..."
						value={searchValue}
						onValueChange={setSearchValue}
					/>
					<CommandEmpty>{emptyMessage}</CommandEmpty>
					<CommandGroup className="max-h-60 overflow-auto">
						{options.map((option) => (
							<CommandItem
								key={option.value}
								value={option.value}
								onSelect={(currentValue) => {
									onValueChange?.(currentValue);
									setOpen(false);
									setSearchValue("");
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										value === option.value ? "opacity-100" : "opacity-0"
									)}
								/>
								{option.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
