import { Prisma } from "@prisma/client";

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
			case "isRoot":
				// Filtre pour les catégories racines (sans parent)
				if (value === true) {
					conditions.push({ parentId: null });
				} else if (value === false) {
					conditions.push({ NOT: { parentId: null } });
				}
				break;

			case "hasChildren":
				// Filtre pour les catégories ayant des enfants
				if (value === true) {
					conditions.push({
						children: {
							some: {},
						},
					});
				} else if (value === false) {
					conditions.push({
						children: {
							none: {},
						},
					});
				}
				break;
		}
	});

	return conditions;
};
