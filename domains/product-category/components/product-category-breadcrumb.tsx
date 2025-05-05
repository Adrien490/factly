import { GetProductCategoryAncestorsReturn } from "@/domains/product-category/features/get-product-category-ancestors/types";
import { GetProductCategoryReturn } from "@/domains/product-category/features/get-product-category/types";
import { getCategoryUrl } from "@/domains/product-category/utils";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/shared/components";
import { ChevronRight, FolderOpenDot } from "lucide-react";
import { notFound } from "next/navigation";
import React, { use } from "react";

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

				{/* Si on n'est pas en mode simple, afficher la hiérarchie complète */}
				{!isSimpleMode && (
					<>
						{/* Séparateur après "Toutes les catégories" */}
						<BreadcrumbSeparator>
							<ChevronRight className="h-4 w-4" />
						</BreadcrumbSeparator>

						{/* Afficher les ancêtres s'ils existent */}
						{productCategoryAncestors!.length > 0 && (
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

						{/* Afficher la catégorie courante */}
						<BreadcrumbItem>
							<BreadcrumbPage>{productCategory!.name}</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				)}

				{/* Si on est en mode simple et qu'un titre est fourni, l'afficher */}
				{isSimpleMode && productCategory && (
					<>
						<BreadcrumbSeparator>
							<ChevronRight className="h-4 w-4" />
						</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbPage>{productCategory.name}</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
