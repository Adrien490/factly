import {
	SupplierFilterSheet,
	SupplierToggleArchivedButton,
} from "@/domains/supplier/components";
import { getSuppliers } from "@/domains/supplier/features/get-suppliers";
import {
	SupplierDataTable,
	SupplierDataTableSkeleton,
} from "@/domains/supplier/features/get-suppliers/components";
import { RefreshSuppliersButton } from "@/domains/supplier/features/refresh-suppliers/components";
import { getSupplierNavigation } from "@/domains/supplier/utils";
import {
	Button,
	HorizontalMenu,
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
import { Briefcase, Calendar, Store, Truck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

type PageProps = {
	searchParams: Promise<{
		// Pagination
		perPage?: string;
		page?: string;
		cursor?: string;

		// Tri
		sortBy?: string;
		sortOrder?: SortOrder;

		// Recherche
		search?: string;

		// Filtres
		status?: SupplierStatus | SupplierStatus[];
		supplierType?: SupplierType;
	}>;
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function SuppliersPage({
	searchParams,
	params,
}: PageProps) {
	const { perPage, page, sortBy, sortOrder, search, status, supplierType } =
		await searchParams;
	const { organizationId } = await params;

	// Construire l'objet de filtres
	const filters: Record<string, string | string[]> = {};
	if (status) {
		filters.status = status;
	} else {
		// Par défaut, exclure les fournisseurs archivés
		filters.status = Object.values(SupplierStatus).filter(
			(status) => status !== SupplierStatus.ARCHIVED
		);
	}
	if (supplierType) filters.supplierType = supplierType;

	// Calculer le nombre de filtres actifs
	const activeFiltersCount = Object.keys(filters).filter((key) => {
		// Ne pas compter le filtre status par défaut (exclusion des archivés)
		if (key === "status" && !status) return false;
		// Ne pas compter le statut "archived" s'il est présent
		if (key === "status" && status === SupplierStatus.ARCHIVED) return false;
		return true;
	}).length;

	const isArchivedView = status === SupplierStatus.ARCHIVED;

	return (
		<PageContainer className="group pb-12">
			{/* En-tête avec action principale */}
			<PageHeader
				title="Fournisseurs"
				description="Gérez votre portefeuille fournisseurs"
			/>

			<HorizontalMenu items={getSupplierNavigation(organizationId)} />

			{/* Barre d'actions principale */}
			<Toolbar>
				<SearchForm
					paramName="search"
					placeholder="Rechercher..."
					className="flex-1 shrink-0"
				/>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<RefreshSuppliersButton organizationId={organizationId} />
						</TooltipTrigger>
						<TooltipContent>
							<p>Rafraîchir la liste des fournisseurs</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<SortingOptionsDropdown
					sortFields={[
						{
							label: "Nom",
							value: "name",
							icon: <Store className="h-4 w-4" />,
						},

						{
							label: "Type de fournisseur",
							value: "supplierType",
							icon: <Truck className="h-4 w-4" />,
						},
						{
							label: "Statut",
							value: "status",
							icon: <Briefcase className="h-4 w-4" />,
						},
						{
							label: "Date de création",
							value: "createdAt",
							icon: <Calendar className="h-4 w-4" />,
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

				<SupplierToggleArchivedButton />

				<Button className="shrink-0" asChild>
					<Link href={`/dashboard/${organizationId}/suppliers/new`}>
						Nouveau fournisseur
					</Link>
				</Button>
			</Toolbar>

			{/* Tableau de données */}
			<Suspense fallback={<SupplierDataTableSkeleton />}>
				<SupplierDataTable
					suppliersPromise={getSuppliers({
						organizationId,
						perPage: Number(perPage) || 10,
						page: Number(page) || 1,
						sortBy: sortBy as string,
						sortOrder: sortOrder as SortOrder,
						search,
						filters,
					})}
				/>
			</Suspense>
		</PageContainer>
	);
}
