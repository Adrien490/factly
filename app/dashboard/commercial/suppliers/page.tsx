import {
	GET_SUPPLIERS_SORT_FIELDS,
	getSuppliers,
} from "@/domains/supplier/features/get-suppliers";
import {
	SupplierDataTable,
	SupplierDataTableSkeleton,
	SupplierFilterSheet,
} from "@/domains/supplier/features/get-suppliers/components";
import { RefreshSuppliersButton } from "@/domains/supplier/features/refresh-suppliers/components";
import {
	Button,
	PageContainer,
	PageHeader,
	SearchForm,
	SortingOptionsDropdown,
	Toolbar,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/components";
import { SortOrder } from "@/shared/types";
import { SupplierStatus, SupplierType } from "@prisma/client";
import { Trash2, Undo2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

type PageProps = {
	searchParams: Promise<{
		perPage?: string;
		page?: string;
		selected?: string[];
		sortBy?: string;
		sortOrder?: SortOrder;
		search?: string;
		status?: SupplierStatus | SupplierStatus[];
		supplierType?: SupplierType;
	}>;
};

export default async function SuppliersPage({ searchParams }: PageProps) {
	const {
		perPage,
		page,
		sortBy,
		sortOrder,
		search,
		status,
		supplierType,
		selected,
	} = await searchParams;
	// Construire l'objet de filtres
	const filters: Record<string, string | string[]> = {};
	const selectedSupplierIds = !Array.isArray(selected)
		? selected
			? [selected]
			: []
		: (selected.filter(Boolean) as string[]);
	if (status) {
		filters.status = status;
	} else {
		// Par défaut, exclure les fournisseurs archivés
		filters.status = Object.values(SupplierStatus).filter(
			(status) => status !== SupplierStatus.ARCHIVED
		);
	}
	if (supplierType) filters.supplierType = supplierType;

	const activeFiltersCount = Object.keys(filters).filter((key) => {
		if (key === "status" && !status) return false;
		if (key === "status" && status === SupplierStatus.ARCHIVED) return false;
		return true;
	}).length;

	const isArchivedView = status === SupplierStatus.ARCHIVED;

	return (
		<PageContainer className="group pb-12">
			<PageHeader
				title="Fournisseurs"
				description="Gérez votre portefeuille fournisseurs"
			/>

			<Toolbar>
				<SearchForm
					paramName="search"
					placeholder="Rechercher..."
					className="flex-1 shrink-0"
				/>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<RefreshSuppliersButton />
						</TooltipTrigger>
						<TooltipContent>
							<p>Rafraîchir la liste des fournisseurs</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<SortingOptionsDropdown
					sortFields={[
						{
							label: "Référence",
							value: "reference",
						},

						{
							label: "Type de fournisseur",
							value: "type",
						},
						{
							label: "Statut",
							value: "status",
						},
						{
							label: "Date de création",
							value: "createdAt",
						},
					]}
					defaultSortBy="createdAt"
					defaultSortOrder="desc"
					className="w-[200px] shrink-0"
				/>

				<SupplierFilterSheet
					activeFiltersCount={activeFiltersCount}
					isArchivedView={isArchivedView}
				/>

				{isArchivedView ? (
					<Button variant="default" className="shrink-0" asChild>
						<Link href={`/dashboard/commercial/suppliers`}>
							<Undo2 className="h-4 w-4 mr-2" />
							Voir tous les fournisseurs
						</Link>
					</Button>
				) : (
					<Button variant="outline" className="shrink-0" asChild>
						<Link
							href={`/dashboard/commercial/suppliers?status=${SupplierStatus.ARCHIVED}`}
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Voir les fournisseurs archivés
						</Link>
					</Button>
				)}

				<Button className="shrink-0" asChild>
					<Link href={`/dashboard/commercial/suppliers/new`}>
						Nouveau fournisseur
					</Link>
				</Button>
			</Toolbar>

			<Suspense fallback={<SupplierDataTableSkeleton />}>
				<SupplierDataTable
					selectedSupplierIds={selectedSupplierIds}
					isArchivedView={isArchivedView}
					suppliersPromise={getSuppliers({
						perPage: Number(perPage) || 10,
						page: Number(page) || 1,
						sortBy: sortBy as (typeof GET_SUPPLIERS_SORT_FIELDS)[number],
						sortOrder: sortOrder as SortOrder,
						search,
						filters,
					})}
				/>
			</Suspense>
		</PageContainer>
	);
}
