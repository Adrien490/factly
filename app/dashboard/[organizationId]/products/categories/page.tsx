import { ProductCategoryBreadcrumb } from "@/domains/product-category/components";
import { ProductCategoryToggleArchivedButton } from "@/domains/product-category/components/product-category-toggle-archived-button";
import { CreateProductCategorySheetForm } from "@/domains/product-category/features/create-product-category";
import { getProductCategories } from "@/domains/product-category/features/get-product-categories";
import { ProductCategoryDataTable } from "@/domains/product-category/features/get-product-categories/components/product-category-datatable";
import { ProductCategoryDataTableSkeleton } from "@/domains/product-category/features/get-product-categories/components/product-category-datatable-skeleton";
import { RefreshProductCategoriesButton } from "@/domains/product-category/features/refresh-product-categories/components/refresh-product-categories-button";
import { getProductNavigation } from "@/domains/product/utils";
import {
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
import { Calendar, Users } from "lucide-react";
import { Suspense } from "react";

interface Props {
	params: Promise<{
		organizationId: string;
	}>;
	searchParams: Promise<{
		search?: string;
		sortBy?: string;
		sortOrder?: string;
		page?: string;
		perPage?: string;
		status?: string;
	}>;
}

export default async function ProductsCategoriesRootPage({
	params,
	searchParams,
}: Props) {
	const { organizationId } = await params;
	const { search, sortBy, sortOrder, page, perPage, status } =
		await searchParams;

	// Afficher uniquement les catégories racines (sans parent)
	return (
		<PageContainer className="pb-12">
			<PageHeader
				title="Catégories"
				description="Gérer vos catégories de produits"
			/>

			<HorizontalMenu items={getProductNavigation(organizationId)} />

			{/* Breadcrumb pour la navigation hiérarchique */}
			<ProductCategoryBreadcrumb organizationId={organizationId} />

			<Toolbar>
				<SearchForm
					paramName="search"
					placeholder="Rechercher une catégorie..."
					className="flex-1 shrink-0"
				/>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<RefreshProductCategoriesButton />
						</TooltipTrigger>
						<TooltipContent>
							<p>Rafraîchir la liste des catégories</p>
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
							label: "Date de création",
							value: "createdAt",
							icon: <Calendar className="h-4 w-4" />,
						},
					]}
					defaultSortBy={sortBy}
					defaultSortOrder={sortOrder as "asc" | "desc"}
					className="w-[200px] shrink-0"
				/>
				<ProductCategoryToggleArchivedButton />
				<Suspense fallback={<ProductCategoryDataTableSkeleton />}>
					<CreateProductCategorySheetForm />
				</Suspense>
			</Toolbar>

			{/* Tableau de données */}
			<div className="mt-6">
				<Suspense fallback={<></>}>
					<ProductCategoryDataTable
						organizationId={organizationId}
						categoriesPromise={getProductCategories({
							organizationId,
							filters: { status: status || "ACTIVE" },
							search,
							sortBy: sortBy as "name" | "createdAt",
							sortOrder: sortOrder as "asc" | "desc",
							parentId: null,
							rootOnly: true,
							page: page ? parseInt(page) : 1,
							perPage: perPage ? parseInt(perPage) : 10,
						})}
					/>
				</Suspense>
			</div>
		</PageContainer>
	);
}
