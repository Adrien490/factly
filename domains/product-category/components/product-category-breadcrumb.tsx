import { GetProductCategoryAncestorsReturn } from "@/domains/product-category/features/get-product-category-ancestors/types";
import { GetProductCategoryReturn } from "@/domains/product-category/features/get-product-category/types";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Skeleton,
} from "@/shared/components";
import { ChevronRight, Home } from "lucide-react";
import { notFound } from "next/navigation";
import React, { use } from "react";
import { getCategoryUrl } from "../utils";

interface ProductCategoryBreadcrumbProps {
	productCategoryPromise?: Promise<GetProductCategoryReturn | null>;
	productCategoryAncestorsPromise?: Promise<GetProductCategoryAncestorsReturn>;
	organizationId: string;
}

export function ProductCategoryBreadcrumb({
	productCategoryPromise,
	productCategoryAncestorsPromise,
	organizationId,
}: ProductCategoryBreadcrumbProps) {
	// Mode simple ou détaillé
	const isSimpleMode =
		!productCategoryPromise || !productCategoryAncestorsPromise;

	// En mode détaillé, résolution des promesses
	const productCategory = !isSimpleMode ? use(productCategoryPromise!) : null;
	const productCategoryAncestors = !isSimpleMode
		? use(productCategoryAncestorsPromise!)
		: [];

	// Si on est en mode détaillé et que la catégorie n'existe pas, rediriger vers 404
	if (!isSimpleMode && !productCategory) {
		notFound();
	}

	return (
		<Breadcrumb className="ml-auto text-sm">
			<BreadcrumbList className="flex flex-nowrap items-center overflow-hidden">
				<BreadcrumbItem className="flex-shrink-0">
					<BreadcrumbLink
						href={`/dashboard/${organizationId}/products/categories`}
						className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
					>
						<Home className="h-3.5 w-3.5" />
						<span className="hidden sm:inline">Catégories</span>
					</BreadcrumbLink>
				</BreadcrumbItem>

				{/* Si on n'est pas en mode simple, afficher la hiérarchie complète */}
				{!isSimpleMode && (
					<>
						{/* Séparateur après "Catégories" */}
						<BreadcrumbSeparator className="mx-1 flex-shrink-0 text-muted-foreground/50">
							<ChevronRight className="h-3 w-3" />
						</BreadcrumbSeparator>

						{/* Afficher les ancêtres s'ils existent */}
						{productCategoryAncestors!.length > 0 ? (
							<>
								{/* Afficher les ancêtres en ordre inverse (du plus éloigné au plus proche) */}
								{[...productCategoryAncestors!]
									.reverse()
									.map((ancestor, index, array) => {
										// Pour chaque ancêtre, on construit le chemin avec ses propres ancêtres
										const ancestorAncestors = array
											.slice(0, array.length - index - 1)
											.reverse();
										const href = getCategoryUrl(
											organizationId,
											ancestor.slug,
											ancestorAncestors
										);

										// Afficher seulement le dernier ancêtre sur petit écran
										const isLastAncestor = index === array.length - 1;
										const showOnMobile = isLastAncestor;

										return (
											<React.Fragment key={ancestor.id}>
												<BreadcrumbItem
													className={`flex-shrink-0 ${
														!showOnMobile ? "hidden sm:block" : ""
													}`}
												>
													<BreadcrumbLink
														href={href}
														className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[100px] md:max-w-[150px]"
														title={ancestor.name}
													>
														{ancestor.name}
													</BreadcrumbLink>
												</BreadcrumbItem>
												<BreadcrumbSeparator
													className={`mx-1 flex-shrink-0 text-muted-foreground/50 ${
														!showOnMobile ? "hidden sm:block" : ""
													}`}
												>
													<ChevronRight className="h-3 w-3" />
												</BreadcrumbSeparator>
											</React.Fragment>
										);
									})}
							</>
						) : productCategoryAncestors!.length === 0 &&
						  productCategory!.parentId ? (
							// État de chargement pour les ancêtres
							<BreadcrumbItem className="flex-shrink-0">
								<div>
									<Skeleton className="h-3 w-16 rounded-md" />
								</div>
							</BreadcrumbItem>
						) : null}

						{/* Afficher la catégorie courante */}
						<BreadcrumbItem className="flex-shrink-0">
							<BreadcrumbPage
								className="font-medium text-foreground truncate max-w-[150px] md:max-w-[200px]"
								title={productCategory!.name}
							>
								{productCategory!.name}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				)}

				{/* Si on est en mode simple et qu'un titre est fourni, l'afficher */}
				{isSimpleMode && productCategory && (
					<>
						<BreadcrumbSeparator className="mx-1 flex-shrink-0 text-muted-foreground/50">
							<ChevronRight className="h-3 w-3" />
						</BreadcrumbSeparator>
						<BreadcrumbItem className="flex-shrink-0">
							<BreadcrumbPage
								className="font-medium text-foreground truncate max-w-[150px] md:max-w-[200px]"
								title={productCategory.name}
							>
								{productCategory.name}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
