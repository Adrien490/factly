import { AddressType, Prisma } from "@prisma/client";

/**
 * Construit les conditions de filtrage pour les adresses
 * @param filters - Objet contenant les filtres à appliquer
 * @returns Tableau de conditions Prisma à utiliser dans une clause AND
 */
export const buildFilterConditions = (
	filters: Record<string, unknown>
): Prisma.AddressWhereInput[] => {
	const conditions: Prisma.AddressWhereInput[] = [];

	if (!filters || Object.keys(filters).length === 0) {
		return conditions;
	}

	Object.entries(filters).forEach(([key, value]) => {
		if (!value) return;

		switch (key) {
			case "addressType":
				if (
					typeof value === "string" &&
					Object.values(AddressType).includes(value as AddressType)
				) {
					conditions.push({ addressType: value as AddressType });
				} else if (Array.isArray(value) && value.length > 0) {
					// Gestion de la sélection multiple pour les types d'adresse
					const validTypes = value.filter(
						(v): v is AddressType =>
							typeof v === "string" &&
							Object.values(AddressType).includes(v as AddressType)
					);

					if (validTypes.length > 0) {
						conditions.push({ addressType: { in: validTypes } });
					}
				}
				break;

			case "isDefault":
				if (typeof value === "boolean") {
					conditions.push({ isDefault: value });
				}
				break;

			case "city":
				if (typeof value === "string" && value.trim() !== "") {
					conditions.push({
						city: {
							contains: value,
							mode: "insensitive",
						},
					});
				}
				break;

			case "postalCode":
				if (typeof value === "string" && value.trim() !== "") {
					conditions.push({
						postalCode: {
							contains: value,
							mode: "insensitive",
						},
					});
				}
				break;

			// Cas par défaut pour les autres propriétés
			default:
				if (typeof value === "string" && value.trim() !== "") {
					conditions.push({
						[key]: {
							contains: value,
							mode: "insensitive",
						},
					});
				}
				break;
		}
	});

	return conditions;
};
