import {
	Badge,
	ClearFiltersButton,
	FormLabel,
	Label,
	Separator,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/components";
import { CheckboxFilter } from "@/shared/components/checkbox-filter";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { ProductStatus } from "@prisma/client";
import { Filter } from "lucide-react";
import { PRODUCT_STATUS_OPTIONS, VAT_RATE_OPTIONS } from "../constants";

interface ProductFilterSheetProps {
	activeFiltersCount: number;
	isArchivedView: boolean;
}

export function ProductFilterSheet({
	activeFiltersCount,
	isArchivedView,
}: ProductFilterSheetProps) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" className="relative">
					<Filter className="size-4 mr-2" />
					Filtres
					{activeFiltersCount > 0 && (
						<Badge className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium text-primary-foreground">
							{activeFiltersCount}
						</Badge>
					)}
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Filtrer les produits</SheetTitle>
					<SheetDescription>
						Filtrez les produits en fonction de vos besoins.
					</SheetDescription>
				</SheetHeader>

				<ScrollArea className="h-[calc(100vh-12rem)] my-4 pr-4">
					<div className="space-y-6">
						{/* Filtre par statut */}
						{!isArchivedView && (
							<div className="space-y-4">
								<FormLabel className="text-base font-medium">Statut</FormLabel>
								<div className="space-y-2">
									{PRODUCT_STATUS_OPTIONS.filter(
										(status) => status.value !== ProductStatus.ARCHIVED
									).map((status) => (
										<div
											key={status.value}
											className="flex items-center space-x-2"
										>
											<CheckboxFilter
												filterKey="status"
												value={status.value}
												id={`status-${status.value}`}
											/>
											<Label
												htmlFor={`status-${status.value}`}
												className="flex items-center cursor-pointer"
											>
												<span
													className="w-2 h-2 rounded-full mr-2"
													style={{ backgroundColor: status.color }}
												/>
												{status.label}
											</Label>
										</div>
									))}
								</div>
							</div>
						)}

						<Separator />

						{/* Filtre par taux de TVA */}
						<div className="space-y-4">
							<FormLabel className="text-base font-medium">
								Taux de TVA
							</FormLabel>
							<div className="space-y-2">
								{VAT_RATE_OPTIONS.map((rate) => (
									<div key={rate.value} className="flex items-center space-x-2">
										<CheckboxFilter
											filterKey="vatRate"
											value={rate.value}
											id={`vatRate-${rate.value}`}
										/>
										<Label
											htmlFor={`vatRate-${rate.value}`}
											className="flex items-center cursor-pointer"
										>
											<span
												className="w-2 h-2 rounded-full mr-2"
												style={{ backgroundColor: rate.color }}
											/>
											{rate.label}
										</Label>
									</div>
								))}
							</div>
						</div>

						<Separator />

						{/* Ici on pourrait ajouter d'autres filtres comme fourchette de prix, etc. */}
					</div>
				</ScrollArea>

				<SheetFooter className="mt-6">
					<ClearFiltersButton
						filters={["status", "vatRate"]}
						label="Réinitialiser les filtres"
						className="w-full"
						excludeFilters={isArchivedView ? ["status"] : []}
					/>
					<Button className="w-full">Fermer</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
