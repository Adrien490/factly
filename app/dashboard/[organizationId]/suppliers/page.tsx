import { hasOrganizationAccess } from "@/domains/organization/features";
import {
	SupplierDataTable,
	SupplierDataTableSkeleton,
} from "@/domains/supplier/components/supplier-datatable";
import {
	SUPPLIER_SORT_FIELDS,
	SUPPLIER_STATUSES,
	SUPPLIER_TYPES,
} from "@/domains/supplier/constants";
import { getSuppliers } from "@/domains/supplier/features/get-suppliers";
import {
	Button,
	Card,
	FilterSelect,
	MultiSelectFilter,
	PageContainer,
	PageHeader,
	SearchForm,
	SortingOptionsDropdown,
} from "@/shared/components";
import { SortOrder } from "@/shared/types";
import Link from "next/link";
import { forbidden } from "next/navigation";
import { Suspense } from "react";

type PageProps = {
	searchParams: Promise<{
		perPage?: string;
		cursor?: string;
		sortBy?: string;
		sortOrder?: SortOrder;
		search?: string;
		[key: string]: string | string[] | undefined;
	}>;
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function SuppliersPage({
	searchParams,
	params,
}: PageProps) {
	const resolvedSearchParams = await searchParams;
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;
	const { perPage, page, sortBy, sortOrder, search, ...filters } =
		resolvedSearchParams;

	if (!hasOrganizationAccess(organizationId)) {
		forbidden();
	}

	return (
		<PageContainer className="pb-12 group">
			{/* En-tête avec action principale */}
			<PageHeader
				title="Fournisseurs"
				description="Gérez votre base de fournisseurs"
				action={
					<Button asChild size="default">
						<Link href={`/dashboard/${organizationId}/suppliers/new`}>
							Nouveau fournisseur
						</Link>
					</Button>
				}
				className="mb-6"
			/>

			{/* Barre de recherche et filtres */}
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
				<SearchForm
					paramName="search"
					placeholder="Rechercher par nom, email, référence, SIREN..."
					className="w-full flex-1 max-w-sm"
				/>
				<span className="text-xs font-medium text-muted-foreground px-1">
					Filtrer par:
				</span>
				<div className="flex flex-wrap gap-2">
					<MultiSelectFilter
						filterKey="status"
						label="Statut"
						options={SUPPLIER_STATUSES}
					/>
					<FilterSelect
						filterKey="supplierType"
						label="Type"
						options={SUPPLIER_TYPES}
					/>

					{/* Dropdown de tri compact */}
					<SortingOptionsDropdown
						sortFields={SUPPLIER_SORT_FIELDS}
						defaultSortBy="createdAt"
						defaultSortOrder="desc"
					/>
				</div>
			</div>

			<Card>
				<Suspense fallback={<SupplierDataTableSkeleton />}>
					<SupplierDataTable
						suppliersPromise={getSuppliers({
							organizationId,
							perPage: Number(perPage) || 10,
							page: Number(page) || 1,
							sortBy: sortBy as string,
							sortOrder: sortOrder as SortOrder,
							search,
							filters: Object.fromEntries(
								Object.entries(filters).filter(
									([, value]) => value !== undefined
								)
							) as Record<string, string | string[] | boolean>,
						})}
					/>
				</Suspense>
			</Card>
		</PageContainer>
	);
}
