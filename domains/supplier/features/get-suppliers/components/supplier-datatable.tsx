import {
	Badge,
	Card,
	CardContent,
	EmptyState,
	ItemCheckbox,
	Pagination,
	SelectAllCheckbox,
	SelectionToolbar,
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

import { ArchivedSupplierSelectionActions } from "@/domains/supplier/components/archived-supplier-selection-actions";
import { SupplierSelectionActions } from "@/domains/supplier/components/supplier-selection-actions";
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
	selectedSupplierIds: string[];
	isArchivedView: boolean;
	organizationId: string;
}

export function SupplierDataTable({
	suppliersPromise,
	selectedSupplierIds,
	isArchivedView,
	organizationId,
}: SupplierDataTableProps) {
	const response = use(suppliersPromise);
	const { suppliers, pagination } = response;
	const supplierIds = suppliers.map((supplier) => supplier.id);

	if (suppliers.length === 0) {
		return (
			<EmptyState
				title="Aucun fournisseur trouvé"
				description="Aucun fournisseur n'a été trouvé. Vous pouvez en créer un nouveau."
				className="group-has-[[data-pending]]:animate-pulse py-12"
			/>
		);
	}

	return (
		<Card>
			<CardContent>
				<SelectionToolbar>
					{isArchivedView ? (
						<ArchivedSupplierSelectionActions
							selectedSupplierIds={selectedSupplierIds}
							organizationId={organizationId}
						/>
					) : (
						<SupplierSelectionActions
							selectedSupplierIds={selectedSupplierIds}
							organizationId={organizationId}
						/>
					)}
				</SelectionToolbar>
				<Table className="group-has-[[data-pending]]:animate-pulse">
					<TableHeader>
						<TableRow>
							<TableHead key="select" role="columnheader" className="w-[50px]">
								<SelectAllCheckbox itemIds={supplierIds} />
							</TableHead>
							<TableHead key="name" role="columnheader" className="w-[220px]">
								Fournisseur
							</TableHead>
							<TableHead
								key="supplierType"
								role="columnheader"
								className="hidden md:table-cell w-[120px]"
							>
								Type
							</TableHead>
							<TableHead
								key="status"
								role="columnheader"
								className="hidden md:table-cell w-[120px]"
							>
								Statut
							</TableHead>
							<TableHead
								key="fiscalInfo"
								role="columnheader"
								className="hidden lg:table-cell w-[180px]"
							>
								Infos fiscales
							</TableHead>
							<TableHead
								key="address"
								role="columnheader"
								className="hidden lg:table-cell w-[240px]"
							>
								Adresse
							</TableHead>
							<TableHead key="actions" role="columnheader" className="w-[80px]">
								<></>
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
											{supplier.company?.name && (
												<div className="flex flex-col gap-0.5">
													<div className="font-medium truncate">
														{supplier.company.name}
													</div>
													{supplier.company.legalForm && (
														<span className="text-xs text-muted-foreground truncate">
															{supplier.company.legalForm}
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
										<Badge
											variant="outline"
											className="truncate"
											style={{
												backgroundColor: `${
													SUPPLIER_TYPE_COLORS[supplier.supplierType]
												}20`,
												color: SUPPLIER_TYPE_COLORS[supplier.supplierType],
												borderColor: `${
													SUPPLIER_TYPE_COLORS[supplier.supplierType]
												}40`,
											}}
										>
											{SUPPLIER_TYPE_LABELS[supplier.supplierType]}
										</Badge>
									</TableCell>
									<TableCell
										role="gridcell"
										className="hidden md:table-cell w-[120px]"
									>
										<Badge
											variant="outline"
											className="truncate"
											style={{
												backgroundColor: `${
													SUPPLIER_STATUS_COLORS[supplier.status]
												}20`,
												color: SUPPLIER_STATUS_COLORS[supplier.status],
												borderColor: `${
													SUPPLIER_STATUS_COLORS[supplier.status]
												}40`,
											}}
										>
											{SUPPLIER_STATUS_LABELS[supplier.status]}
										</Badge>
									</TableCell>
									<TableCell
										role="gridcell"
										className="hidden lg:table-cell w-[180px]"
									>
										<div className="flex flex-col space-y-1 max-w-[150px]">
											{supplier.company?.siret && (
												<div className="flex items-center gap-1.5 text-xs">
													<Receipt className="h-3 w-3 shrink-0 text-muted-foreground" />
													<span className="truncate">
														{supplier.company.siret}
													</span>
												</div>
											)}
											{supplier.company?.vatNumber && (
												<div className="flex items-center gap-1.5 text-xs">
													<CircleDot className="h-3 w-3 shrink-0 text-muted-foreground" />
													<span className="truncate">
														{supplier.company.vatNumber}
													</span>
												</div>
											)}
											{!supplier.company?.siret &&
												!supplier.company?.vatNumber && (
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
											{supplier.addresses && supplier.addresses.length > 0 ? (
												<span className="truncate text-muted-foreground">
													{[
														supplier.addresses[0].addressLine1,
														supplier.addresses[0].postalCode,
														supplier.addresses[0].city,
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
							<TableCell colSpan={7} className="px-4 py-2 hover:bg-transparent">
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
