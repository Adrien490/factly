import { Prisma } from "@prisma/client";

/**
 * Construit les conditions de filtrage pour les catégories de produits
 */
export function buildFilterConditions(
	filters: Record<string, unknown>
): Prisma.ProductCategoryWhereInput[] {
	const conditions: Prisma.ProductCategoryWhereInput[] = [];

	Object.entries(filters).forEach(([key, value]) => {
		if (!value) return;

		switch (key) {
			case "name":
				if (typeof value === "string" && value.trim() !== "") {
					conditions.push({
						name: {
							contains: value,
							mode: "insensitive",
						},
					});
				}
				break;

			default:
				// Gestion générique des autres champs
				if (typeof value === "string" && value.trim() !== "") {
					conditions.push({
						[key]: {
							contains: value,
							mode: "insensitive",
						},
					});
				} else if (Array.isArray(value) && value.length > 0) {
					conditions.push({
						[key]: {
							in: value.filter((v): v is string => typeof v === "string"),
						},
					});
				}
				break;
		}
	});

	return conditions;
}
