"use client";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Loader2, Search, X } from "lucide-react";
import { useState } from "react";

export type AutocompleteOption = {
	label: string;
	value: string;
};

export type AutocompleteProps = {
	options: AutocompleteOption[];
	value?: string;
	onChange?: (value: string) => void;
	onSelect?: (option: AutocompleteOption) => void;
	onClear?: () => void;
	placeholder?: string;
	isLoading?: boolean;
	className?: string;
};

export function Autocomplete({
	options,
	value,
	onChange,
	onSelect,
	onClear,
	placeholder = "Rechercher...",
	isLoading = false,
	className,
}: AutocompleteProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className={cn("relative w-full", className)}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<div className="relative flex w-full items-center">
						<div className="absolute left-3 flex items-center">
							{isLoading ? (
								<Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
							) : (
								<Search className="text-muted-foreground h-4 w-4" />
							)}
						</div>
						<Input
							value={value || ""}
							onChange={(e) => {
								onChange?.(e.target.value);
								if (!open) setOpen(true);
							}}
							className="w-full pl-10 pr-8"
							placeholder={placeholder}
						/>
						{value && (
							<Button
								variant="ghost"
								onClick={() => {
									onClear?.();
									onChange?.("");
								}}
								className="absolute right-0 hover:bg-transparent"
								type="button"
							>
								<X className="h-4 w-4 text-muted-foreground" />
							</Button>
						)}
					</div>
				</PopoverTrigger>
				<PopoverContent
					className="w-[--radix-popover-trigger-width] p-0"
					align="start"
				>
					<Command>
						<CommandInput hidden />
						<CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
						<CommandGroup className="max-h-[300px] overflow-auto">
							{options.map((option) => (
								<CommandItem
									key={option.value}
									onSelect={() => {
										onSelect?.(option);
										onChange?.(option.label);
										setOpen(false);
									}}
									className="cursor-pointer"
								>
									{option.label}
								</CommandItem>
							))}
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
