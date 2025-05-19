import {
	Badge,
	ClearFiltersButton,
	FormLabel,
	Label,
	Separator,
	Sheet,
	SheetClose,
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
import { SupplierStatus } from "@prisma/client";
import { Filter } from "lucide-react";
import {
	SUPPLIER_STATUS_OPTIONS,
	SUPPLIER_TYPE_OPTIONS,
} from "../../../constants";

interface SupplierFilterSheetProps {
	activeFiltersCount: number;
	isArchivedView: boolean;
}

export function SupplierFilterSheet({
	activeFiltersCount,
	isArchivedView,
}: SupplierFilterSheetProps) {
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
					<SheetTitle>Filtrer les fournisseurs</SheetTitle>
					<SheetDescription>
						Filtrez les fournisseurs en fonction de vos besoins.
					</SheetDescription>
				</SheetHeader>

				<ScrollArea className="h-[calc(100vh-12rem)] my-4 pr-4">
					<div className="space-y-6">
						{/* Filtre par type de fournisseur */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<FormLabel className="text-base font-medium">
									Type de fournisseur
								</FormLabel>
							</div>

							<div className="space-y-2">
								{SUPPLIER_TYPE_OPTIONS.map((type) => (
									<div key={type.value} className="flex items-center space-x-2">
										<CheckboxFilter
											filterKey="supplierType"
											value={type.value}
											id={`type-${type.value}`}
										/>
										<Label
											htmlFor={`type-${type.value}`}
											className="flex items-center cursor-pointer"
										>
											<span
												className="w-2 h-2 rounded-full mr-2"
												style={{ backgroundColor: type.color }}
											/>
											{type.label}
										</Label>
									</div>
								))}
							</div>
						</div>

						<Separator />

						{!isArchivedView && (
							<div className="space-y-4">
								<FormLabel className="text-base font-medium">Statut</FormLabel>
								<div className="space-y-2">
									{SUPPLIER_STATUS_OPTIONS.filter(
										(status) => status.value !== SupplierStatus.ARCHIVED
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
					</div>
				</ScrollArea>

				<SheetFooter className="mt-6">
					<ClearFiltersButton
						filters={["supplierType", "status"]}
						label="Réinitialiser les filtres"
						className="w-full"
						excludeFilters={isArchivedView ? ["status"] : []}
					/>
					<SheetClose asChild>
						<Button className="w-full">Fermer</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
