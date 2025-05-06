import {
	Badge,
	Card,
	CardContent,
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

import {
	SUPPLIER_STATUS_COLORS,
	SUPPLIER_STATUS_LABELS,
	SUPPLIER_TYPE_COLORS,
	SUPPLIER_TYPE_LABELS,
} from "@/domains/supplier/constants";
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
		<Card>
			<CardContent>
				<Table className="group-has-[[data-pending]]:animate-pulse">
					<TableHeader>
						<TableRow>
							<TableHead key="select" role="columnheader" className="w-[50px]">
								<div className="flex-1 font-medium">
									<SelectAllCheckbox itemIds={supplierIds} />
								</div>
							</TableHead>
							<TableHead key="name" role="columnheader" className="w-[220px]">
								<div className="flex-1 font-medium">Fournisseur</div>
							</TableHead>
							<TableHead
								key="supplierType"
								role="columnheader"
								className="hidden md:table-cell w-[120px]"
							>
								<div className="flex-1 font-medium">Type</div>
							</TableHead>
							<TableHead
								key="status"
								role="columnheader"
								className="hidden md:table-cell w-[120px]"
							>
								<div className="flex-1 font-medium">Statut</div>
							</TableHead>
							<TableHead
								key="fiscalInfo"
								role="columnheader"
								className="hidden lg:table-cell w-[180px]"
							>
								<div className="flex-1 font-medium">Infos fiscales</div>
							</TableHead>
							<TableHead
								key="address"
								role="columnheader"
								className="hidden lg:table-cell w-[240px]"
							>
								<div className="flex-1 font-medium">Adresse</div>
							</TableHead>

							<TableHead key="actions" role="columnheader" className="w-[80px]">
								<div className="flex-1 font-medium"></div>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{suppliers.map((supplier) => {
							const isArchived = supplier.status === SupplierStatus.ARCHIVED;

							return (
								<TableRow key={supplier.id} role="row" tabIndex={0}>
									<TableCell role="gridcell" className="w-[50px]">
										<ItemCheckbox itemId={supplier.id} />
									</TableCell>
									<TableCell role="gridcell" className="w-[220px]">
										<div className="flex flex-col space-y-1">
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
									<TableCell
										role="gridcell"
										className="hidden md:table-cell w-[120px]"
									>
										<div className="flex items-center gap-2">
											<Badge
												variant="outline"
												className="truncate"
												style={{
													backgroundColor: `${
														SUPPLIER_TYPE_COLORS[supplier.supplierType]
													}20`, // Couleur avec opacity 20%
													color: SUPPLIER_TYPE_COLORS[supplier.supplierType],
													borderColor: `${
														SUPPLIER_TYPE_COLORS[supplier.supplierType]
													}40`, // Couleur avec opacity 40%
												}}
											>
												{SUPPLIER_TYPE_LABELS[supplier.supplierType]}
											</Badge>
										</div>
									</TableCell>
									<TableCell
										role="gridcell"
										className="hidden md:table-cell w-[120px]"
									>
										<div>
											<Badge
												variant="outline"
												className="truncate"
												style={{
													backgroundColor: `${
														SUPPLIER_STATUS_COLORS[supplier.status]
													}20`, // Couleur avec opacity 20%
													color: SUPPLIER_STATUS_COLORS[supplier.status],
													borderColor: `${
														SUPPLIER_STATUS_COLORS[supplier.status]
													}40`, // Couleur avec opacity 40%
												}}
											>
												{SUPPLIER_STATUS_LABELS[supplier.status]}
											</Badge>
										</div>
									</TableCell>
									<TableCell
										role="gridcell"
										className="hidden lg:table-cell w-[180px]"
									>
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
												<span className="text-xs text-muted-foreground italic truncate">
													Non renseignées
												</span>
											)}
										</div>
									</TableCell>
									<TableCell
										role="gridcell"
										className="hidden lg:table-cell w-[240px]"
									>
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
												<span className="text-muted-foreground italic truncate">
													Non renseignée
												</span>
											)}
										</div>
									</TableCell>
									<TableCell
										role="gridcell"
										className="flex justify-end w-[80px]"
									>
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
			</CardContent>
		</Card>
	);
}
