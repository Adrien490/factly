import {
	Badge,
	EmptyState,
	ItemCheckbox,
	Pagination,
	SelectAllCheckbox,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components";
import { CircleDot, MapPin, Receipt } from "lucide-react";
import { use } from "react";

import { SupplierSelectionToolbar } from "@/domains/supplier/components";
import {
	SUPPLIER_STATUSES,
	SUPPLIER_TYPES,
} from "@/domains/supplier/constants";
import { SelectionProvider } from "@/shared/contexts";
import { SupplierStatus } from "@prisma/client";
import { ArchivedSupplierActions } from "../../../components/archived-supplier-actions";
import { SupplierActions } from "../../../components/supplier-actions";
import { GetSuppliersReturn } from "../types";

export interface SupplierDataTableProps {
	suppliersPromise: Promise<GetSuppliersReturn>;
}

export function SupplierDataTable({
	suppliersPromise,
}: SupplierDataTableProps) {
	const response = use(suppliersPromise);
	const { suppliers, pagination } = response;
	const supplierIds = suppliers.map((supplier) => supplier.id);

	if (suppliers.length === 0) {
		return (
			<EmptyState
				title="Aucune donnée trouvée"
				description="Aucune donnée ne correspond à vos critères de recherche."
				className="group-has-[[data-pending]]:animate-pulse py-12"
			/>
		);
	}

	// Calculer le nombre de colonnes pour le colSpan
	const columnCount = 7; // Le nombre total de colonnes dans le tableau

	return (
		<SelectionProvider>
			<SupplierSelectionToolbar />
			<Table className="group-has-[[data-pending]]:animate-pulse">
				<TableHeader>
					<TableRow>
						<TableHead key="select" role="columnheader">
							<div className="flex-1 font-medium">
								<SelectAllCheckbox itemIds={supplierIds} />
							</div>
						</TableHead>
						<TableHead key="name" role="columnheader">
							<div className="flex-1 font-medium">Fournisseur</div>
						</TableHead>
						<TableHead
							key="supplierType"
							role="columnheader"
							className="hidden md:table-cell"
						>
							<div className="flex-1 font-medium">Type</div>
						</TableHead>
						<TableHead
							key="status"
							role="columnheader"
							className="hidden md:table-cell"
						>
							<div className="flex-1 font-medium">Statut</div>
						</TableHead>
						<TableHead
							key="fiscalInfo"
							role="columnheader"
							className="hidden lg:table-cell"
						>
							<div className="flex-1 font-medium">Infos fiscales</div>
						</TableHead>
						<TableHead
							key="address"
							role="columnheader"
							className="hidden lg:table-cell"
						>
							<div className="flex-1 font-medium">Adresse</div>
						</TableHead>

						<TableHead key="actions" role="columnheader" className="">
							<div className="flex-1 font-medium"></div>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{suppliers.map((supplier) => {
						const supplierTypeOption = SUPPLIER_TYPES.find(
							(option) => option.value === supplier.supplierType
						);

						const statusOption = SUPPLIER_STATUSES.find(
							(option) => option.value === supplier.status
						);

						const isArchived = supplier.status === SupplierStatus.ARCHIVED;

						return (
							<TableRow key={supplier.id} role="row" tabIndex={0}>
								<TableCell role="gridcell">
									<ItemCheckbox itemId={supplier.id} />
								</TableCell>
								<TableCell role="gridcell">
									<div className="w-[200px] flex flex-col space-y-1">
										{supplier.name && (
											<div className="flex flex-col gap-0.5">
												<span className="font-medium truncate">
													{supplier.name}
												</span>
												{supplier.legalName && (
													<span className="text-xs text-muted-foreground truncate">
														{supplier.legalName}
													</span>
												)}
											</div>
										)}
									</div>
								</TableCell>
								<TableCell role="gridcell" className="hidden md:table-cell">
									<div className="flex items-center gap-2">
										<Badge
											variant="outline"
											style={{
												backgroundColor: `${supplierTypeOption?.color}20`, // Couleur avec opacity 20%
												color: supplierTypeOption?.color,
												borderColor: `${supplierTypeOption?.color}40`, // Couleur avec opacity 40%
											}}
										>
											{supplierTypeOption?.label || supplier.supplierType}
										</Badge>
									</div>
								</TableCell>
								<TableCell role="gridcell" className="hidden md:table-cell">
									<div>
										<Badge
											variant="outline"
											style={{
												backgroundColor: `${statusOption?.color}20`, // Couleur avec opacity 20%
												color: statusOption?.color,
												borderColor: `${statusOption?.color}40`, // Couleur avec opacity 40%
											}}
										>
											{statusOption?.label || supplier.status}
										</Badge>
									</div>
								</TableCell>
								<TableCell role="gridcell" className="hidden lg:table-cell">
									<div className="flex flex-col space-y-1 max-w-[150px]">
										{supplier.siret && (
											<div className="flex items-center gap-1.5 text-xs">
												<Receipt className="h-3 w-3 shrink-0 text-muted-foreground" />
												<span className="truncate">{supplier.siret}</span>
											</div>
										)}
										{supplier.vatNumber && (
											<div className="flex items-center gap-1.5 text-xs">
												<CircleDot className="h-3 w-3 shrink-0 text-muted-foreground" />
												<span className="truncate">{supplier.vatNumber}</span>
											</div>
										)}
										{!supplier.siret && !supplier.vatNumber && (
											<span className="text-xs text-muted-foreground italic">
												Non renseignées
											</span>
										)}
									</div>
								</TableCell>
								<TableCell role="gridcell" className="hidden lg:table-cell">
									<div className="flex items-center gap-2 max-w-[200px]">
										<MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
										{supplier.addresses?.find((addr) => addr.isDefault) ? (
											<span className="truncate">
												{[
													supplier.addresses.find((addr) => addr.isDefault)
														?.addressLine1,
													supplier.addresses.find((addr) => addr.isDefault)
														?.postalCode,
													supplier.addresses.find((addr) => addr.isDefault)
														?.city,
												]
													.filter(Boolean)
													.join(", ")}
											</span>
										) : (
											<span className="text-muted-foreground italic">
												Non renseignée
											</span>
										)}
									</div>
								</TableCell>
								<TableCell role="gridcell" className="flex justify-end">
									{isArchived ? (
										<ArchivedSupplierActions supplier={supplier} />
									) : (
										<SupplierActions supplier={supplier} />
									)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell
							colSpan={columnCount}
							className="px-4 py-2 hover:bg-transparent"
						>
							<Pagination
								total={pagination.total}
								pageCount={pagination.pageCount}
								page={pagination.page}
								perPage={pagination.perPage}
							/>
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</SelectionProvider>
	);
}
