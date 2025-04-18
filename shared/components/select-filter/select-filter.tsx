"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components";
import { SpinnerLoader } from "@/shared/components/loaders/spinner-loader";
import { ScrollArea } from "@/shared/components/shadcn-ui/scroll-area";
import { cn } from "@/shared/utils";
import { X } from "lucide-react";
import { useSelectFilter } from "./hooks/use-select-filter";
import { SelectFilterProps } from "./types";

export function SelectFilter({
	filterKey,
	label,
	options,
	placeholder = "Sélectionner...",
	className,
	maxHeight = 250,
}: SelectFilterProps) {
	const { value, setFilter, clearFilter, isPending } =
		useSelectFilter(filterKey);

	// Gérer le changement de valeur
	const handleSelect = (value: string) => {
		setFilter(value);
	};

	// Gérer la réinitialisation
	const handleClear = () => {
		clearFilter();
	};

	return (
		<div
			data-pending={isPending ? "" : undefined}
			className={cn("min-w-[180px] relative", className)}
		>
			<Select
				value={value || ""}
				onValueChange={handleSelect}
				disabled={isPending}
			>
				<SelectTrigger className="w-full h-10">
					<div className="flex items-center w-full text-left">
						<span className="text-muted-foreground text-xs mr-2">{label}</span>
						<div className="flex-1">
							<SelectValue placeholder={placeholder} />
						</div>
						<div className="flex items-center gap-1 ml-1">
							{isPending ? (
								<SpinnerLoader size="xs" className="ml-2" color="primary" />
							) : (
								value && (
									<span
										className="h-5 w-5 p-0 rounded-full inline-flex items-center justify-center cursor-pointer hover:bg-accent/50"
										onClick={(e) => {
											e.stopPropagation();
											handleClear();
										}}
									>
										<X className="h-3 w-3" />
									</span>
								)
							)}
						</div>
					</div>
				</SelectTrigger>
				<SelectContent>
					<ScrollArea className={`h-${maxHeight}`}>
						{options.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</ScrollArea>
				</SelectContent>
			</Select>
		</div>
	);
}
