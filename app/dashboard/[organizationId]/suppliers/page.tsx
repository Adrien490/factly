import { SUPPLIER_SORT_FIELDS } from "@/domains/supplier/constants";
import {
	getSuppliers,
	SupplierDataTable,
	SupplierDataTableSkeleton,
} from "@/domains/supplier/features/get-suppliers";
import { RefreshSuppliersButton } from "@/domains/supplier/features/refresh-suppliers";
import { getSupplierNavigation } from "@/domains/supplier/utils/get-supplier-navigation";
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
		type?: SupplierType;
	}>;
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function SuppliersPage({
	searchParams,
	params,
}: PageProps) {
	const { perPage, page, sortBy, sortOrder, search, status, type } =
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
	if (type) filters.type = type;

	return (
		<PageContainer className="group pb-12">
			{/* En-tête avec action principale */}
			<PageHeader
				title="Fournisseurs"
				description="Gérez votre portefeuille fournisseurs"
			/>

			<HorizontalMenu items={getSupplierNavigation(organizationId)} />

			{/* Barre d'actions principale */}
			<Toolbar
				leftContent={
					<div className="flex items-center gap-3 flex-1">
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
					</div>
				}
				rightContent={
					<>
						<SortingOptionsDropdown
							sortFields={SUPPLIER_SORT_FIELDS}
							defaultSortBy="createdAt"
							defaultSortOrder="desc"
							className="w-[200px] shrink-0"
						/>

						<Button className="shrink-0" asChild>
							<Link href={`/dashboard/${organizationId}/suppliers/new`}>
								Nouveau fournisseur
							</Link>
						</Button>
					</>
				}
			/>

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
