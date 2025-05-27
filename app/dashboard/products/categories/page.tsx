import { CreateProductCategorySheetForm } from "@/domains/product-category/features/create-product-category";
import { getProductCategories } from "@/domains/product-category/features/get-product-categories";
import { ProductCategoryDataTable } from "@/domains/product-category/features/get-product-categories/components/product-category-datatable";
import { ProductCategoryDataTableSkeleton } from "@/domains/product-category/features/get-product-categories/components/product-category-datatable-skeleton";
import { RefreshProductCategoriesButton } from "@/domains/product-category/features/refresh-product-categories/components/refresh-product-categories-button";
import { getProductNavigation } from "@/domains/product/utils";
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
import { ProductCategoryStatus } from "@prisma/client";
import { Calendar, Trash2, Undo2, Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
	searchParams: Promise<{
		search?: string;
		sortBy?: string;
		sortOrder?: string;
		page?: string;
		perPage?: string;
		status?: string;
		isArchivedView?: boolean;
	}>;
}

export default async function ProductsCategoriesPage({ searchParams }: Props) {
	const { search, sortBy, sortOrder, page, perPage, status, isArchivedView } =
		await searchParams;

	// Afficher uniquement les catégories racines (sans parent)
	return (
		<PageContainer className="pb-12">
			<PageHeader
				title="Catégories"
				description="Gérer vos catégories de produits"
			/>

			<HorizontalMenu items={getProductNavigation()} />

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
				{isArchivedView ? (
					<Button variant="default" className="shrink-0" asChild>
						<Link href={`/dashboard/products/categories`}>
							<Undo2 className="h-4 w-4 mr-2" />
							Voir toutes les catégories
						</Link>
					</Button>
				) : (
					<Button variant="outline" className="shrink-0" asChild>
						<Link
							href={`/dashboard/products/categories?status=${ProductCategoryStatus.ARCHIVED}`}
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Voir les catégories archivées
						</Link>
					</Button>
				)}
				<Suspense fallback={<ProductCategoryDataTableSkeleton />}>
					<CreateProductCategorySheetForm />
				</Suspense>
			</Toolbar>

			{/* Tableau de données */}
			<div className="mt-6">
				<Suspense fallback={<></>}>
					<ProductCategoryDataTable
						categoriesPromise={getProductCategories({
							filters: { status: status || "ACTIVE" },
							search,
							sortBy: sortBy as "name" | "createdAt",
							sortOrder: sortOrder as "asc" | "desc",
							page: page ? parseInt(page) : 1,
							perPage: perPage ? parseInt(perPage) : 10,
						})}
					/>
				</Suspense>
			</div>
		</PageContainer>
	);
}
