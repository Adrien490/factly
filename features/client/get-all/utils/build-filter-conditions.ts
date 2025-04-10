import { ClientStatus, ClientType, Prisma } from "@prisma/client";

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
		}
	});

	return conditions;
};
