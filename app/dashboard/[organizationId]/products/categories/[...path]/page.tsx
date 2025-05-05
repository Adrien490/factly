import { SubCategoryBreadcrumb } from "@/domains/product-category/components";
import { CreateProductCategorySheetForm } from "@/domains/product-category/features/create-product-category/components/create-product-category-sheet-form";
import { getProductCategories } from "@/domains/product-category/features/get-product-categories";
import { ProductCategoryDataTable } from "@/domains/product-category/features/get-product-categories/components/product-category-datatable";
import { ProductCategoryDataTableSkeleton } from "@/domains/product-category/features/get-product-categories/components/product-category-datatable-skeleton";
import { getProductCategory } from "@/domains/product-category/features/get-product-category";
import { getAncestors } from "@/domains/product-category/features/get-product-category-ancestors";
import { RefreshProductCategoriesButton } from "@/domains/product-category/features/refresh-product-categories/components/refresh-product-categories-button";
import { getProductNavigation } from "@/domains/product/utils";
import {
	EmptyState,
	HorizontalMenu,
	PageContainer,
	PageHeader,
	SearchForm,
	Toolbar,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/components";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Props {
	params: Promise<{
		organizationId: string;
		path: string[];
	}>;
	searchParams: Promise<{
		search?: string;
		page?: string;
		perPage?: string;
	}>;
}

export default async function ProductsCategoriesPathPage({
	params,
	searchParams,
}: Props) {
	const { organizationId, path } = await params;
	const { search, page, perPage } = await searchParams;

	// Récupérer le dernier slug dans le chemin pour trouver la catégorie actuelle
	const currentSlug = path[path.length - 1];

	// Récupérer les informations de la catégorie courante sans récursion profonde
	const currentCategory = await getProductCategory({
		organizationId,
		slug: currentSlug,
	});

	// Si la catégorie n'existe pas, rediriger vers 404
	if (!currentCategory) {
		notFound();
	}

	// Récupérer les ancêtres avec notre nouvelle fonction

	return (
		<PageContainer>
			<PageHeader
				title={`Catégorie: ${currentCategory.name}`}
				description="Gérer les sous-catégories"
			/>

			<HorizontalMenu items={getProductNavigation(organizationId)} />

			{/* Breadcrumb pour la navigation hiérarchique */}
			<SubCategoryBreadcrumb
				organizationId={organizationId}
				categoryPromise={getProductCategory({
					organizationId,
					slug: currentSlug,
				})}
				ancestorsPromise={getAncestors({
					organizationId,
					categoryId: currentCategory.id,
					maxDepth: 10,
				})}
			/>

			<Toolbar>
				<SearchForm
					paramName="search"
					placeholder="Rechercher une sous-catégorie..."
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

				<Suspense fallback={<></>}>
					<CreateProductCategorySheetForm
						defaultValues={{
							organizationId,
							name: "",
							description: "",
							parentId: currentCategory.id,
						}}
						categoriesPromise={getProductCategories({
							organizationId,
							filters: {},
							search: "",
							rootOnly: false,
							sortBy: "name",
							sortOrder: "asc",
							parentId: null,
							page: page ? parseInt(page) : 1,
							perPage: perPage ? parseInt(perPage) : 50,
						})}
					/>
				</Suspense>
			</Toolbar>

			{/* Tableau de données */}
			<div className="mt-6">
				<Suspense fallback={<ProductCategoryDataTableSkeleton />}>
					<ProductCategoryDataTable
						emptyState={
							<EmptyState
								title="Aucune sous-catégorie trouvée"
								description="Aucune sous-catégorie n'a été trouvée. Vous pouvez en créer une nouvelle."
							/>
						}
						categoriesPromise={getProductCategories({
							organizationId,
							filters: {},
							search: search || "",
							rootOnly: false,
							sortBy: "name",
							sortOrder: "asc",
							parentId: currentCategory.id,
							page: page ? parseInt(page) : 1,
							perPage: perPage ? parseInt(perPage) : 50,
						})}
						organizationId={organizationId}
					/>
				</Suspense>
			</div>
		</PageContainer>
	);
}
