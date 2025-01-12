"use client";

import FilterField, { FilterFieldProps } from "@/components/filter-field";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export type FilterSheetProps = {
	filters: FilterFieldProps[];
	title?: string;
	description?: string;
	className?: string;
	side?: "left" | "right" | "top" | "bottom";
};

export default function FilterSheet({
	filters,
	title = "Filtres",
	description = "Filtrez les résultats selon vos critères",
	className,
	side = "right",
}: FilterSheetProps) {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const searchParams = useSearchParams();
	const router = useRouter();

	// Compte le nombre de filtres actifs
	const activeFilters = filters.reduce((count, filter) => {
		const value = searchParams.get(`filter_${filter.name}`);
		return value ? count + 1 : count;
	}, 0);

	const resetFilters = () => {
		startTransition(() => {
			const params = new URLSearchParams(searchParams.toString());
			filters.forEach((filter) => {
				params.delete(`filter_${filter.name}`);
			});
			params.delete("page");
			router.push(`?${params.toString()}`, { scroll: false });
		});
		setOpen(false);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					data-pending={isPending ? "" : undefined}
					variant="outline"
					size="sm"
					className={cn(
						"group relative h-8 w-auto min-w-[80px] hover:bg-muted/50 transition-colors",
						activeFilters > 0 && "border-primary font-medium",
						isPending && "opacity-70 cursor-not-allowed",
						className
					)}
					disabled={isPending}
				>
					<Filter className="h-4 w-4 shrink-0" />
					<span className="ml-2 text-sm">Filtres</span>
					{activeFilters > 0 && (
						<div className="ml-2 inline-flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-medium text-primary-foreground">
							{activeFilters}
						</div>
					)}
				</Button>
			</SheetTrigger>
			<SheetContent side={side} className="flex w-full flex-col sm:max-w-md">
				<SheetHeader className="space-y-2.5 px-6">
					<div className="flex items-center justify-between gap-4">
						<SheetTitle className="text-lg font-semibold">{title}</SheetTitle>
						{activeFilters > 0 && (
							<div className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
								{activeFilters} filtre{activeFilters > 1 ? "s" : ""} actif
								{activeFilters > 1 ? "s" : ""}
							</div>
						)}
					</div>
					<SheetDescription className="text-sm text-muted-foreground">
						{description}
					</SheetDescription>
				</SheetHeader>

				<Separator className="mb-6" />

				<ScrollArea className="flex-1 px-6">
					<div className="grid gap-6 pb-6">
						{filters.map((filter) => (
							<div
								key={filter.name}
								className={cn(
									"grid gap-2 transition-opacity duration-200",
									isPending && "opacity-50 pointer-events-none"
								)}
							>
								<div className="flex items-center justify-between">
									<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
										{filter.label}
									</label>
									{filter.type === "select" && (
										<span className="text-[10px] text-muted-foreground">
											Sélection unique
										</span>
									)}
								</div>
								<FilterField {...filter} className="w-full" />
							</div>
						))}
					</div>
				</ScrollArea>

				<div className="border-t bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="flex items-center justify-between gap-4">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setOpen(false)}
							className="min-w-[80px]"
							disabled={isPending}
						>
							Fermer
						</Button>
						{activeFilters > 0 && (
							<Button
								variant="destructive"
								size="sm"
								onClick={resetFilters}
								disabled={isPending}
								className="gap-2 min-w-[120px]"
							>
								<X className="h-4 w-4 shrink-0" />
								Réinitialiser
							</Button>
						)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
