import { CreateProductCategorySheetForm } from "@/domains/product-category/features/create-product-category";
import { getProductCategories } from "@/domains/product-category/features/get-product-categories";
import { RefreshProductCategoriesButton } from "@/domains/product-category/features/refresh-product-categories/components/refresh-product-categories-button";
import { getProductNavigation } from "@/domains/product/utils";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
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
import { Calendar, FolderOpenDot, Users } from "lucide-react";
import { Suspense } from "react";
import { ProductCategoriesTree } from "./components/product-categories-tree";

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

	// Préparation des valeurs par défaut
	const searchValue = search || "";
	const sortByValue =
		sortBy === "name" || sortBy === "createdAt" ? sortBy : "name";
	const sortOrderValue =
		sortOrder === "asc" || sortOrder === "desc" ? sortOrder : "asc";

	// Afficher uniquement les catégories racines (sans parent)
	return (
		<PageContainer className="pb-12">
			<PageHeader
				title="Catégories"
				description="Gérer vos catégories de produits"
			/>

			<HorizontalMenu items={getProductNavigation(organizationId)} />

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
					defaultSortBy={sortByValue}
					defaultSortOrder={sortOrderValue}
					className="w-[200px] shrink-0"
				/>
				<Suspense fallback={<></>}>
					<CreateProductCategorySheetForm
						categoriesPromise={getProductCategories({
							organizationId,
							filters: {},
							search: searchValue,
							sortBy: sortByValue,
							sortOrder: sortOrderValue,
							parentId: null,
							format: "flat",
						})}
					/>
				</Suspense>
			</Toolbar>

			{/* Tableau de données */}
			<div className="mt-6">
				<Suspense
					fallback={
						<div className="h-96 w-full animate-pulse bg-muted/50 rounded-lg"></div>
					}
				>
					<ProductCategoriesTree
						categoriesPromise={getProductCategories({
							organizationId,
							filters: {},
							search: searchValue,
							sortBy: sortByValue,
							sortOrder: sortOrderValue,
							parentId: null,
							format: "tree",
						})}
					/>
				</Suspense>
			</div>
		</PageContainer>
	);
}
