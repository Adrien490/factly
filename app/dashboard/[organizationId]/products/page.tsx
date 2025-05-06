import { RefreshClientsButton } from "@/domains/client/features/refresh-clients";
import { ArchivedProductSelectionActions } from "@/domains/product/components/archived-product-selection-actions";
import { ProductFilterSheet } from "@/domains/product/components/product-filter-sheet";
import { ProductSelectionActions } from "@/domains/product/components/product-selection-actions";
import {
	GET_PRODUCTS_SORT_FIELDS,
	ProductDataTable,
	ProductDataTableSkeleton,
	getProducts,
} from "@/domains/product/features";
import { getProductNavigation } from "@/domains/product/utils";
import {
	Button,
	Calendar,
	HorizontalMenu,
	PageContainer,
	PageHeader,
	SearchForm,
	SelectionToolbar,
	SortingOptionsDropdown,
	Toolbar,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/components";
import { SortOrder } from "@/shared/types";
import { ProductStatus } from "@prisma/client";
import { DollarSign, Tag, Trash2, Undo2, Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface ProductsPageProps {
	searchParams: Promise<{
		selected?: string[];
		perPage?: string;
		page?: string;
		sortBy?: string;
		sortOrder?: SortOrder;
		search?: string;
		status?: ProductStatus | ProductStatus[];
	}>;
	params: Promise<{
		organizationId: string;
	}>;
}
export default async function ProductsPage({
	searchParams,
	params,
}: ProductsPageProps) {
	const { perPage, page, sortBy, sortOrder, search, status, selected } =
		await searchParams;
	const { organizationId } = await params;

	const filters: Record<string, string | string[]> = {};
	const selectedProductIds = !Array.isArray(selected)
		? selected
			? [selected]
			: []
		: (selected.filter(Boolean) as string[]);
	if (status) {
		filters.status = status;
	} else {
		filters.status = Object.values(ProductStatus).filter(
			(status) => status !== ProductStatus.ARCHIVED
		);
	}

	const activeFiltersCount = Object.keys(filters).filter((key) => {
		if (key === "status" && !status) return false;
		if (key === "status" && status === ProductStatus.ARCHIVED) return false;
		return true;
	}).length;

	const isArchivedView = status === ProductStatus.ARCHIVED;

	return (
		<PageContainer>
			<PageHeader title="Produits" description="Gérez vos produits" />

			<HorizontalMenu items={getProductNavigation(organizationId)} />

			<Toolbar>
				<SearchForm
					paramName="search"
					placeholder="Rechercher..."
					className="flex-1 shrink-0"
				/>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<RefreshClientsButton />
						</TooltipTrigger>
						<TooltipContent>
							<p>Rafraîchir la liste des clients</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<SortingOptionsDropdown
					sortFields={[
						{
							label: "Nom",
							value: "name",
							icon: <Users className="h-4 w-4" />,
						},
						{
							label: "Référence",
							value: "reference",
							icon: <Tag className="h-4 w-4" />,
						},
						{
							label: "Date de création",
							value: "createdAt",
							icon: <Calendar className="h-4 w-4" />,
						},
						{
							label: "Prix",
							value: "price",
							icon: <DollarSign className="h-4 w-4" />,
						},
					]}
					defaultSortBy="createdAt"
					defaultSortOrder="desc"
					className="w-[200px] shrink-0"
				/>

				<ProductFilterSheet
					activeFiltersCount={activeFiltersCount}
					isArchivedView={isArchivedView}
				/>

				{isArchivedView ? (
					<Button variant="default" className="shrink-0" asChild>
						<Link href={`/dashboard/${organizationId}/products`}>
							<Undo2 className="h-4 w-4 mr-2" />
							Voir tous les produits
						</Link>
					</Button>
				) : (
					<Button variant="outline" className="shrink-0" asChild>
						<Link
							href={`/dashboard/${organizationId}/products?status=${ProductStatus.ARCHIVED}`}
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Voir les produits archivés
						</Link>
					</Button>
				)}

				<Button className="shrink-0" asChild>
					<Link href={`/dashboard/${organizationId}/products/new`}>
						Nouveau produit
					</Link>
				</Button>
			</Toolbar>
			<SelectionToolbar>
				{isArchivedView ? (
					<ArchivedProductSelectionActions
						selectedProductIds={selectedProductIds}
						organizationId={organizationId}
					/>
				) : (
					<ProductSelectionActions
						selectedProductIds={selectedProductIds}
						organizationId={organizationId}
					/>
				)}
			</SelectionToolbar>
			<Suspense fallback={<ProductDataTableSkeleton />}>
				<ProductDataTable
					productsPromise={getProducts({
						organizationId,
						perPage: Number(perPage) || 10,
						page: Number(page) || 1,
						sortBy: sortBy as (typeof GET_PRODUCTS_SORT_FIELDS)[number],
						sortOrder: sortOrder as SortOrder,
						search,
						filters,
					})}
				/>
			</Suspense>
		</PageContainer>
	);
}
