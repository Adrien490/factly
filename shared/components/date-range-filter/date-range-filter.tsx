"use client";

import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/utils";
import { addDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { DateRange as CalendarDateRange } from "react-day-picker";
import { useDateRangeFilter } from "./hooks/use-date-range-filter";
import { DateRangeFilterProps } from "./types";

export function DateRangeFilter({
	filterKey,
	label,
	placeholder = "Sélectionner une période",
	format: displayFormat = "dd/MM/yyyy",
	minDate,
	maxDate,
	className,
	onDateRangeChange,
}: DateRangeFilterProps) {
	const { dateRange, setDateRange, clearDateRange, isPending } =
		useDateRangeFilter(filterKey);
	const [open, setOpen] = useState(false);

	// Formater la plage de dates pour l'affichage
	const formatDateRange = () => {
		if (!dateRange.from) return placeholder;

		if (!dateRange.to) {
			return `À partir du ${format(new Date(dateRange.from), displayFormat, {
				locale: fr,
			})}`;
		}

		return `${format(new Date(dateRange.from), displayFormat, {
			locale: fr,
		})} - ${format(new Date(dateRange.to), displayFormat, { locale: fr })}`;
	};

	// Gérer le changement de plage de dates
	const handleDateRangeChange = (range: CalendarDateRange | undefined) => {
		if (!range) {
			clearDateRange();
			return;
		}

		const newRange = {
			from: range.from ? range.from.toISOString() : null,
			to: range.to ? range.to.toISOString() : null,
		};

		setDateRange(newRange);

		if (onDateRangeChange) {
			onDateRangeChange(newRange);
		}

		if (range.from && range.to) {
			setOpen(false);
		}
	};

	// Gérer la réinitialisation
	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		clearDateRange();
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
							"w-full min-w-[240px] justify-start text-left font-normal",
							!dateRange.from && "text-muted-foreground"
						)}
						disabled={isPending}
					>
						<div className="flex items-center w-full">
							<span className="text-muted-foreground text-xs font-medium mr-2 flex-shrink-0">
								{label}:
							</span>
							<div className="flex-1 truncate">{formatDateRange()}</div>
							<div className="flex items-center gap-1 ml-1 flex-shrink-0">
								<>
									{(dateRange.from || dateRange.to) && (
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
						mode="range"
						defaultMonth={
							dateRange.from ? new Date(dateRange.from) : new Date()
						}
						selected={{
							from: dateRange.from ? new Date(dateRange.from) : undefined,
							to: dateRange.to ? new Date(dateRange.to) : undefined,
						}}
						onSelect={handleDateRangeChange}
						numberOfMonths={2}
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
							{/* Boutons pour sélection rapide */}
							<Button
								variant="secondary"
								size="sm"
								onClick={() => {
									const today = new Date();
									handleDateRangeChange({
										from: today,
										to: today,
									});
								}}
							>
								Aujourd&apos;hui
							</Button>
							<Button
								variant="secondary"
								size="sm"
								onClick={() => {
									const today = new Date();
									const lastWeek = addDays(today, -7);
									handleDateRangeChange({
										from: lastWeek,
										to: today,
									});
								}}
							>
								7 derniers jours
							</Button>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
