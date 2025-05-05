import { CreateProductCategorySheetForm } from "@/domains/product-category/features/create-product-category";
import { getProductCategories } from "@/domains/product-category/features/get-product-categories";
import { ProductCategoryDataTable } from "@/domains/product-category/features/get-product-categories/components/product-category-datatable";
import { ProductCategoryDataTableSkeleton } from "@/domains/product-category/features/get-product-categories/components/product-category-datatable-skeleton";
import { RefreshProductCategoriesButton } from "@/domains/product-category/features/refresh-product-categories/components/refresh-product-categories-button";
import {
	PageContainer,
	PageHeader,
	SearchForm,
	Toolbar,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/components";
import { Suspense } from "react";

interface Props {
	params: {
		organizationId: string;
	};
	searchParams: {
		search?: string;
	};
}

export default async function ProductsCategoriesRootPage({
	params,
	searchParams,
}: Props) {
	const { organizationId } = params;
	const { search } = searchParams;

	// Afficher uniquement les catégories racines (sans parent)
	return (
		<PageContainer className="pb-12">
			<PageHeader
				title="Catégories"
				description="Gérer vos catégories de produits"
			/>

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
							sortBy: "name",
							sortOrder: "asc",
							parentId: null,
						})}
						organizationId={organizationId}
					/>
				</Suspense>
			</div>
		</PageContainer>
	);
}
