import {
	ClientPriority,
	ClientStatus,
	ClientType,
	Prisma,
} from "@prisma/client";

/**
 * Construit les conditions de filtrage pour les clients
 * @param filters - Objet contenant les filtres à appliquer
 * @returns Tableau de conditions Prisma à utiliser dans une clause AND
 */
export const buildFilterConditions = (
	filters: Record<string, unknown>
): Prisma.ClientWhereInput[] => {
	const conditions: Prisma.ClientWhereInput[] = [];

	if (!filters || Object.keys(filters).length === 0) {
		return conditions;
	}

	Object.entries(filters).forEach(([key, value]) => {
		if (!value) return;

		switch (key) {
			case "status":
				if (
					typeof value === "string" &&
					Object.values(ClientStatus).includes(value as ClientStatus)
				) {
					conditions.push({ status: value as ClientStatus });
				} else if (Array.isArray(value) && value.length > 0) {
					// Gestion de la sélection multiple pour les statuts
					const validStatuses = value.filter(
						(v): v is ClientStatus =>
							typeof v === "string" &&
							Object.values(ClientStatus).includes(v as ClientStatus)
					);

					if (validStatuses.length > 0) {
						conditions.push({ status: { in: validStatuses } });
					}
				}
				break;

			case "clientType":
				if (
					typeof value === "string" &&
					Object.values(ClientType).includes(value as ClientType)
				) {
					conditions.push({ clientType: value as ClientType });
				} else if (Array.isArray(value) && value.length > 0) {
					// Gestion de la sélection multiple pour les types de client
					const validTypes = value.filter(
						(v): v is ClientType =>
							typeof v === "string" &&
							Object.values(ClientType).includes(v as ClientType)
					);

					if (validTypes.length > 0) {
						conditions.push({ clientType: { in: validTypes } });
					}
				}
				break;

			case "priority":
				if (
					typeof value === "string" &&
					Object.values(ClientPriority).includes(value as ClientPriority)
				) {
					conditions.push({ priority: value as ClientPriority });
				} else if (Array.isArray(value) && value.length > 0) {
					// Gestion de la sélection multiple pour les priorités
					const validPriorities = value.filter(
						(v): v is ClientPriority =>
							typeof v === "string" &&
							Object.values(ClientPriority).includes(v as ClientPriority)
					);

					if (validPriorities.length > 0) {
						conditions.push({ priority: { in: validPriorities } });
					}
				}
				break;

			case "city":
				if (typeof value === "string" && value.trim()) {
					conditions.push({
						addresses: {
							some: { city: { contains: value, mode: "insensitive" } },
						},
					});
				}
				break;

			case "postalCode":
				if (typeof value === "string" && value.trim()) {
					conditions.push({
						addresses: { some: { postalCode: { equals: value } } },
					});
				}
				break;
		}
	});

	return conditions;
};
