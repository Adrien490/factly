import { CreateProductCategorySheetForm } from "@/domains/product-category/features/create-product-category";
import { getProductCategories } from "@/domains/product-category/features/get-product-categories";
import { ProductCategoryDataTable } from "@/domains/product-category/features/get-product-categories/components/product-category-datatable";
import { RefreshProductCategoriesButton } from "@/domains/product-category/features/refresh-product-categories/components/refresh-product-categories-button";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
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

	// Récupérer les informations de la catégorie courante
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
				},
			},
		},
	});

	// Si la catégorie n'existe pas, rediriger vers 404
	if (!currentCategory) {
		notFound();
	}

	// Construire le fil d'Ariane (breadcrumb)
	// Pour une implémentation complète, on pourrait récupérer toute l'arborescence des parents
	const breadcrumbItems = [];

	// Ajouter le parent s'il existe
	if (currentCategory.parent) {
		breadcrumbItems.push({
			name: currentCategory.parent.name,
			href: `/dashboard/${organizationId}/categories/${currentCategory.parent.slug}`,
		});
	}

	return (
		<PageContainer>
			<PageHeader
				title={`Catégorie: ${currentCategory.name}`}
				description="Gérer les sous-catégories"
			/>

			{/* Breadcrumb pour la navigation hiérarchique */}
			<Breadcrumb className="mb-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink
							href={`/dashboard/${organizationId}/categories`}
							className="flex items-center gap-1.5"
						>
							<FolderOpenDot className="h-4 w-4" />
							Catégories racines
						</BreadcrumbLink>
					</BreadcrumbItem>

					{breadcrumbItems.length > 0 && (
						<>
							<BreadcrumbSeparator>
								<ChevronRight className="h-4 w-4" />
							</BreadcrumbSeparator>
							{breadcrumbItems.map((item) => (
								<BreadcrumbItem key={item.href}>
									<BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
								</BreadcrumbItem>
							))}
							<BreadcrumbSeparator>
								<ChevronRight className="h-4 w-4" />
							</BreadcrumbSeparator>
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
						categoriesPromise={getProductCategories({
							organizationId,
							filters: {},
							search: "",
							rootOnly: false,
							sortBy: "name",
							sortOrder: "asc",
							parentId: currentCategory.id,
							page: page ? parseInt(page) : 1,
							perPage: perPage ? parseInt(perPage) : 50,
						})}
					/>
				</Suspense>
			</Toolbar>

			{/* Tableau de données */}
			<div className="mt-6">
				<Suspense fallback={<></>}>
					<ProductCategoryDataTable
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
