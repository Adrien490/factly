import { CreateProductCategorySheetForm } from "@/domains/product-category/features/create-product-category";
import {
	getProductCategories,
	GetProductCategorySortField,
} from "@/domains/product-category/features/get-product-categories";
import { ProductCategoryDataTable } from "@/domains/product-category/features/get-product-categories/components/product-category-datatable";
import { ProductCategoryDataTableSkeleton } from "@/domains/product-category/features/get-product-categories/components/product-category-datatable-skeleton";
import { RefreshProductCategoriesButton } from "@/domains/product-category/features/refresh-product-categories/components/refresh-product-categories-button";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
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
import { Calendar, FolderOpenDot, Users } from "lucide-react";
import { Suspense } from "react";

interface Props {
	params: Promise<{
		organizationId: string;
	}>;
	searchParams: Promise<{
		search?: string;
		sortBy?: string;
		sortOrder?: string;
	}>;
}

export default async function ProductsCategoriesRootPage({
	params,
	searchParams,
}: Props) {
	const { organizationId } = await params;
	const { search, sortBy, sortOrder } = await searchParams;

	// Afficher uniquement les catégories racines (sans parent)
	return (
		<PageContainer className="pb-12">
			<PageHeader
				title="Catégories"
				description="Gérer vos catégories de produits"
			/>

			{/* Breadcrumb pour la navigation hiérarchique */}
			<Breadcrumb className="mb-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbPage className="flex items-center gap-1.5">
							<FolderOpenDot className="h-4 w-4" />
							Catégories racines
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<Toolbar
				leftContent={
					<div className="flex items-center gap-3 flex-1">
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
					</div>
				}
				rightContent={
					<>
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
							defaultSortBy="name"
							defaultSortOrder="asc"
							className="w-[200px] shrink-0"
						/>
						<Suspense fallback={<></>}>
							<CreateProductCategorySheetForm
								categoriesPromise={getProductCategories({
									organizationId,
									filters: {},
									search: "",
									sortBy: "name",
									sortOrder: "asc",
									parentId: null,
								})}
							/>
						</Suspense>
					</>
				}
			/>

			{/* Tableau de données */}
			<div className="mt-6">
				<Suspense fallback={<ProductCategoryDataTableSkeleton />}>
					<ProductCategoryDataTable
						categoriesPromise={getProductCategories({
							organizationId,
							filters: {},
							search: search || "",
							sortBy: sortBy as GetProductCategorySortField,
							sortOrder: sortOrder as SortOrder,
							parentId: null,
							include: {
								childCount: true,
								parent: true,
							},
						})}
						organizationId={organizationId}
					/>
				</Suspense>
			</div>
		</PageContainer>
	);
}
