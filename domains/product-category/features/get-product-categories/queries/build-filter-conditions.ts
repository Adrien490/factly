import { Prisma, ProductCategoryStatus } from "@prisma/client";

/**
 * Construit les conditions de filtrage pour les catégories de produits
 * @param filters - Objet contenant les filtres à appliquer
 * @returns Tableau de conditions Prisma à utiliser dans une clause AND
 */
export const buildFilterConditions = (
	filters: Record<string, unknown>
): Prisma.ProductCategoryWhereInput[] => {
	const conditions: Prisma.ProductCategoryWhereInput[] = [];

	if (!filters || Object.keys(filters).length === 0) {
		return conditions;
	}

	Object.entries(filters).forEach(([key, value]) => {
		if (!value) return;

		switch (key) {
			case "status":
				if (
					typeof value === "string" &&
					Object.values(ProductCategoryStatus).includes(
						value as ProductCategoryStatus
					)
				) {
					conditions.push({ status: value as ProductCategoryStatus });
				} else if (Array.isArray(value) && value.length > 0) {
					// Gestion de la sélection multiple pour les statuts
					const validStatuses = value.filter(
						(v): v is ProductCategoryStatus =>
							typeof v === "string" &&
							Object.values(ProductCategoryStatus).includes(
								v as ProductCategoryStatus
							)
					);

					if (validStatuses.length > 0) {
						conditions.push({ status: { in: validStatuses } });
					}
				}
				break;
		}
	});

	return conditions;
};
