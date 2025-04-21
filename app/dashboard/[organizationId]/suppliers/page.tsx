import {
	SupplierDataTable,
	SupplierDataTableSkeleton,
} from "@/domains/supplier/components/supplier-datatable";
import { SUPPLIER_SORT_FIELDS } from "@/domains/supplier/constants";
import { getSupplierNavigation } from "@/domains/supplier/constants/get-supplier-navigation";
import { getSuppliers } from "@/domains/supplier/features/get-suppliers";
import type { GetSuppliersParams } from "@/domains/supplier/features/get-suppliers/types";
import { RefreshSuppliersButton } from "@/domains/supplier/features/refresh-suppliers";
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
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

type PageProps = {
	searchParams: Promise<{
		perPage?: string;
		page?: string;
		sortBy?: string;
		sortOrder?: SortOrder;
		search?: string;
		status?: SupplierStatus | SupplierStatus[];
		supplierType?: SupplierType | SupplierType[];
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

	return (
		<PageContainer className="group">
			{/* En-tête avec action principale */}
			<PageHeader
				title="Fournisseurs"
				description="Gérez votre base de fournisseurs"
			/>

			<HorizontalMenu items={getSupplierNavigation(organizationId)} />

			{/* Barre d'actions principale */}
			<Toolbar
				leftContent={
					<>
						<SearchForm
							paramName="search"
							placeholder="Rechercher par nom, email, référence, SIREN..."
							className="flex-1 shrink-0"
						/>
						<RefreshSuppliersButton organizationId={organizationId}>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button type="submit" variant="outline">
											<RefreshCw className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Rafraîchir la liste des fournisseurs</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</RefreshSuppliersButton>
					</>
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
							Object.entries(filters).filter(([, value]) => value !== undefined)
						) as GetSuppliersParams["filters"],
					})}
				/>
			</Suspense>
		</PageContainer>
	);
}
