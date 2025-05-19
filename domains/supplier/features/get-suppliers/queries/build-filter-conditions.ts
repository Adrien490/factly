import { Prisma, SupplierStatus, SupplierType } from "@prisma/client";

/**
 * Construit les conditions de filtrage pour les fournisseurs
 * @param filters - Objet contenant les filtres à appliquer
 * @returns Tableau de conditions Prisma à utiliser dans une clause AND
 */
export const buildFilterConditions = (
	filters: Record<string, unknown>
): Prisma.SupplierWhereInput[] => {
	const conditions: Prisma.SupplierWhereInput[] = [];

	if (!filters || Object.keys(filters).length === 0) {
		return conditions;
	}

	Object.entries(filters).forEach(([key, value]) => {
		if (!value) return;

		switch (key) {
			case "status":
				if (
					typeof value === "string" &&
					Object.values(SupplierStatus).includes(value as SupplierStatus)
				) {
					conditions.push({ status: value as SupplierStatus });
				} else if (Array.isArray(value) && value.length > 0) {
					// Gestion de la sélection multiple pour les statuts
					const validStatuses = value.filter(
						(v): v is SupplierStatus =>
							typeof v === "string" &&
							Object.values(SupplierStatus).includes(v as SupplierStatus)
					);

					if (validStatuses.length > 0) {
						conditions.push({ status: { in: validStatuses } });
					}
				}
				break;

			case "supplierType":
				if (
					typeof value === "string" &&
					Object.values(SupplierType).includes(value as SupplierType)
				) {
					conditions.push({ type: value as SupplierType });
				} else if (Array.isArray(value) && value.length > 0) {
					// Gestion de la sélection multiple pour les types de fournisseur
					const validTypes = value.filter(
						(v): v is SupplierType =>
							typeof v === "string" &&
							Object.values(SupplierType).includes(v as SupplierType)
					);

					if (validTypes.length > 0) {
						conditions.push({ type: { in: validTypes } });
					}
				}
				break;

			case "name":
			case "legalName":
			case "email":
			case "siret":
			case "siren":
				// Gestion des champs textuels standards
				if (typeof value === "string" && value.trim() !== "") {
					conditions.push({
						[key]: { contains: value.trim(), mode: "insensitive" },
					});
				}
				break;
		}
	});

	return conditions;
};
