import { Prisma, ProductStatus, VatRate } from "@prisma/client";

/**
 * Construit les conditions de filtre pour la requête Prisma à partir des filtres fournis
 * @param filters - Objet contenant les filtres à appliquer
 * @returns Tableau de conditions Prisma pour la clause AND
 */
export const buildFilterConditions = (
	filters: Record<string, unknown>
): Prisma.ProductWhereInput[] => {
	const conditions: Prisma.ProductWhereInput[] = [];

	// Filtrage par statut (string ou string[])
	if (filters.status) {
		if (Array.isArray(filters.status)) {
			conditions.push({
				status: {
					in: filters.status as ProductStatus[],
				},
			});
		} else {
			conditions.push({
				status: filters.status as ProductStatus,
			});
		}
	}

	// Filtrage par taux de TVA (string ou string[])
	if (filters.vatRate) {
		if (Array.isArray(filters.vatRate)) {
			conditions.push({
				vatRate: {
					in: filters.vatRate as VatRate[],
				},
			});
		} else {
			conditions.push({
				vatRate: filters.vatRate as VatRate,
			});
		}
	}

	// Filtrage par catégorie (string ou string[])
	if (filters.categoryId) {
		if (Array.isArray(filters.categoryId)) {
			conditions.push({
				categoryId: {
					in: filters.categoryId as string[],
				},
			});
		} else {
			conditions.push({
				categoryId: filters.categoryId as string,
			});
		}
	}

	// Filtrage par fournisseur (string ou string[])
	if (filters.supplierId) {
		if (Array.isArray(filters.supplierId)) {
			conditions.push({
				supplierId: {
					in: filters.supplierId as string[],
				},
			});
		} else {
			conditions.push({
				supplierId: filters.supplierId as string,
			});
		}
	}

	// Filtrage par référence (string ou string[])
	if (filters.reference) {
		if (Array.isArray(filters.reference)) {
			conditions.push({
				reference: {
					in: filters.reference as string[],
				},
			});
		} else {
			conditions.push({
				reference: {
					contains: filters.reference as string,
					mode: "insensitive",
				},
			});
		}
	}

	// Filtrage par nom (string ou string[])
	if (filters.name) {
		if (Array.isArray(filters.name)) {
			conditions.push({
				OR: (filters.name as string[]).map((name) => ({
					name: { contains: name, mode: "insensitive" },
				})),
			});
		} else {
			conditions.push({
				name: {
					contains: filters.name as string,
					mode: "insensitive",
				},
			});
		}
	}

	// Filtrage par prix (intervalle ou valeur précise)
	if (filters.price) {
		if (Array.isArray(filters.price) && filters.price.length > 0) {
			// Si tableau, traiter comme [min, max]
			if (filters.price.length >= 2) {
				const min = Number(filters.price[0]);
				const max = Number(filters.price[1]);
				conditions.push({
					price: {
						gte: !isNaN(min) ? min : undefined,
						lte: !isNaN(max) ? max : undefined,
					},
				});
			} else {
				// Si un seul élément, traiter comme valeur exacte
				const price = Number(filters.price[0]);
				if (!isNaN(price)) {
					conditions.push({
						price,
					});
				}
			}
		} else {
			// Si simple valeur, traiter comme valeur exacte
			const price = Number(filters.price);
			if (!isNaN(price)) {
				conditions.push({
					price,
				});
			}
		}
	}

	return conditions;
};
