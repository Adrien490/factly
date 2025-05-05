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

interface SubCategoryBreadcrumbProps {
	categoryPromise: Promise<GetProductCategoryReturn | null>;
	ancestorsPromise: Promise<GetProductCategoryAncestorsReturn>;
	organizationId: string;
}

export function SubCategoryBreadcrumb({
	categoryPromise,
	ancestorsPromise,
	organizationId,
}: SubCategoryBreadcrumbProps) {
	// Résolution des promesses
	const category = use(categoryPromise);
	const ancestors = use(ancestorsPromise);

	// Si la catégorie n'existe pas, rediriger vers 404
	if (!category) {
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
										<BreadcrumbLink href={href}>{ancestor.name}</BreadcrumbLink>
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
					<BreadcrumbPage>{category.name}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
