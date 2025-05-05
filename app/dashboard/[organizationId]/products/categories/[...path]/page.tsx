import { CreateProductCategorySheetForm } from "@/domains/product-category/features/create-product-category";
import { getProductCategories } from "@/domains/product-category/features/get-product-categories";
import { ProductCategoryDataTable } from "@/domains/product-category/features/get-product-categories/components/product-category-datatable";
import { ProductCategoryDataTableSkeleton } from "@/domains/product-category/features/get-product-categories/components/product-category-datatable-skeleton";
import { RefreshProductCategoriesButton } from "@/domains/product-category/features/refresh-product-categories/components/refresh-product-categories-button";
import {
	getCategoryAncestors,
	getCategoryUrl,
} from "@/domains/product-category/utils";
import { getProductNavigation } from "@/domains/product/utils";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
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
import db from "@/shared/lib/db";
import { ChevronRight, FolderOpenDot } from "lucide-react";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

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

	// Récupérer les informations de la catégorie courante avec toute sa hiérarchie de parents
	const currentCategory = await db.productCategory.findFirst({
		where: {
			slug: currentSlug,
			organizationId,
		},
		select: {
			id: true,
			name: true,
			slug: true,
			parent: {
				select: {
					id: true,
					name: true,
					slug: true,
					parent: {
						select: {
							id: true,
							name: true,
							slug: true,
							parent: {
								select: {
									id: true,
									name: true,
									slug: true,
								},
							},
						},
					},
				},
			},
		},
	});

	// Si la catégorie n'existe pas, rediriger vers 404
	if (!currentCategory) {
		notFound();
	}

	// Récupérer tous les ancêtres (parents) de la catégorie courante
	const ancestors = getCategoryAncestors(currentCategory);

	return (
		<PageContainer>
			<PageHeader
				title={`Catégorie: ${currentCategory.name}`}
				description="Gérer les sous-catégories"
			/>

			<HorizontalMenu items={getProductNavigation(organizationId)} />

			{/* Breadcrumb pour la navigation hiérarchique */}
			<Breadcrumb className="mb-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink
							href={`/dashboard/${organizationId}/products/categories`}
							className="flex items-center gap-1.5"
						>
							<FolderOpenDot className="h-4 w-4" />
							Toutes les catégories
						</BreadcrumbLink>
					</BreadcrumbItem>

					{/* Toujours ajouter un séparateur après le premier élément */}
					<BreadcrumbSeparator>
						<ChevronRight className="h-4 w-4" />
					</BreadcrumbSeparator>

					{ancestors.length > 0 && (
						<>
							{/* Afficher les ancêtres en ordre inverse (du plus éloigné au plus proche) */}
							{[...ancestors].reverse().map((ancestor, index, array) => {
								// Pour chaque ancêtre, on construit le chemin avec ses propres ancêtres
								const ancestorAncestors = array
									.slice(0, array.length - index - 1)
									.reverse();
								const href = getCategoryUrl(
									organizationId,
									ancestor.slug,
									ancestorAncestors
								);

								return (
									<React.Fragment key={ancestor.id}>
										<BreadcrumbItem>
											<BreadcrumbLink href={href}>
												{ancestor.name}
											</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator>
											<ChevronRight className="h-4 w-4" />
										</BreadcrumbSeparator>
									</React.Fragment>
								);
							})}
						</>
					)}

					<BreadcrumbItem>
						<BreadcrumbPage>{currentCategory.name}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

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
