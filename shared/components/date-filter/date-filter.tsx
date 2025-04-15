"use client";

import { Button } from "@/shared/components";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/shared/components/shadcn-ui/popover";
import { cn } from "@/shared/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { Calendar } from "../shadcn-ui/calendar";
import { useDateFilter } from "./hooks";
import { DateFilterProps } from "./types";

export function DateFilter({
	filterKey,
	label,
	placeholder = "Sélectionner une date",
	format: displayFormat = "dd/MM/yyyy",
	minDate,
	maxDate,
	className,
	onDateChange,
}: DateFilterProps) {
	const { date, setDate, clearDate, isPending } = useDateFilter(filterKey);
	const [open, setOpen] = useState(false);

	// Formater la date pour l'affichage
	const formatDate = () => {
		if (!date) return placeholder;
		return format(new Date(date), displayFormat, { locale: fr });
	};

	// Gérer le changement de date
	const handleDateChange = (selectedDate: Date | undefined) => {
		if (!selectedDate) {
			clearDate();
			return;
		}

		const newDate = selectedDate.toISOString();

		setDate(newDate);

		if (onDateChange) {
			onDateChange(newDate);
		}

		setOpen(false);
	};

	// Gérer la réinitialisation
	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		clearDate();
	};

	return (
		<div
			data-pending={isPending ? "" : undefined}
			className={cn("relative", className)}
		>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className={cn(
							"w-full min-w-[200px] justify-start text-left font-normal",
							!date && "text-muted-foreground"
						)}
						disabled={isPending}
					>
						<div className="flex items-center w-full">
							<span className="text-muted-foreground text-xs font-medium mr-2 flex-shrink-0">
								{label}:
							</span>
							<div className="flex-1 truncate">{formatDate()}</div>
							<div className="flex items-center gap-1 ml-1 flex-shrink-0">
								<>
									{date && (
										<span
											className="h-5 w-5 p-0 rounded-full inline-flex items-center justify-center cursor-pointer hover:bg-accent/50"
											onClick={handleClear}
										>
											<X className="h-3 w-3" />
										</span>
									)}
									<CalendarIcon className="h-4 w-4 opacity-50" />
								</>
							</div>
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						initialFocus
						mode="single"
						defaultMonth={date ? new Date(date) : new Date()}
						selected={date ? new Date(date) : undefined}
						onSelect={handleDateChange}
						locale={fr}
						disabled={(date) => {
							if (minDate && date < minDate) return true;
							if (maxDate && date > maxDate) return true;
							return false;
						}}
					/>
					<div className="p-3 border-t border-border flex justify-between">
						<Button variant="outline" size="sm" onClick={() => setOpen(false)}>
							Fermer
						</Button>

						<div className="flex gap-2">
							{/* Bouton pour sélection rapide */}
							<Button
								variant="secondary"
								size="sm"
								onClick={() => {
									const today = new Date();
									handleDateChange(today);
								}}
							>
								Aujourd&apos;hui
							</Button>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
