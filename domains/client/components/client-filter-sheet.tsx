import { CLIENT_STATUSES } from "@/domains/client/constants/client-statuses";
import { CLIENT_TYPES } from "@/domains/client/constants/client-types";
import { Badge } from "@/shared/components";
import { CheckboxFilter } from "@/shared/components/checkbox-filter";
import { ClearFiltersButton } from "@/shared/components/clear-filters-button";
import { Button } from "@/shared/components/ui/button";
import { FormLabel } from "@/shared/components/ui/form";
import { Label } from "@/shared/components/ui/label";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/components/ui/sheet";
import { ClientStatus } from "@prisma/client";
import { Filter } from "lucide-react";

interface ClientFilterSheetProps {
	activeFiltersCount?: number;
}

export function ClientFilterSheet({
	activeFiltersCount = 0,
}: ClientFilterSheetProps) {
	// Filtrer les statuts pour exclure ARCHIVED
	const availableStatuses = CLIENT_STATUSES.filter(
		(status) => status.value !== ClientStatus.ARCHIVED
	);

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
			<SheetContent className="w-[400px] sm:max-w-md">
				<SheetHeader>
					<SheetTitle>Filtrer les clients</SheetTitle>
					<SheetDescription>
						Filtrez les clients en fonction de vos besoins.
					</SheetDescription>
				</SheetHeader>

				<ScrollArea className="h-[calc(100vh-12rem)] my-4 pr-4">
					<div className="space-y-6">
						{/* Filtre par type de client (RadioGroup) */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<FormLabel className="text-base font-medium">
									Type de client
								</FormLabel>
							</div>

							<div className="space-y-2">
								{CLIENT_TYPES.map((type) => (
									<div key={type.value} className="flex items-center space-x-2">
										<CheckboxFilter
											filterKey="type"
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

						{/* Filtre par statut (Checkbox) */}
						<div className="space-y-4">
							<FormLabel className="text-base font-medium">Statut</FormLabel>
							<div className="space-y-2">
								{availableStatuses.map((status) => (
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
					</div>
				</ScrollArea>

				<SheetFooter className="mt-6">
					<ClearFiltersButton
						filters={["type", "status"]}
						label="Réinitialiser les filtres"
						className="w-full"
					/>
					<Button className="w-full">Fermer</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
