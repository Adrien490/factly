import { InvitationStatus, Prisma } from "@prisma/client";

/**
 * Construit les conditions de filtrage pour les invitations
 * @param filters - Objet contenant les filtres à appliquer
 * @returns Tableau de conditions Prisma à utiliser dans une clause AND
 */
export const buildFilterConditions = (
	filters: Record<string, unknown>
): Prisma.InvitationWhereInput[] => {
	const conditions: Prisma.InvitationWhereInput[] = [];

	if (!filters || Object.keys(filters).length === 0) {
		return conditions;
	}

	Object.entries(filters).forEach(([key, value]) => {
		if (!value) return;

		switch (key) {
			case "status":
				if (
					typeof value === "string" &&
					Object.values(InvitationStatus).includes(value as InvitationStatus)
				) {
					conditions.push({ status: value as InvitationStatus });
				} else if (Array.isArray(value) && value.length > 0) {
					// Gestion de la sélection multiple pour les statuts
					const validStatuses = value.filter(
						(v): v is InvitationStatus =>
							typeof v === "string" &&
							Object.values(InvitationStatus).includes(v as InvitationStatus)
					);

					if (validStatuses.length > 0) {
						conditions.push({ status: { in: validStatuses } });
					}
				}
				break;

			case "expiresAt":
				if (value === "expired") {
					// Invitations expirées (date d'expiration passée)
					conditions.push({
						expiresAt: {
							lt: new Date(),
						},
					});
				} else if (value === "active") {
					// Invitations non expirées (date d'expiration future)
					conditions.push({
						expiresAt: {
							gt: new Date(),
						},
					});
				}
				break;

			case "email":
				if (typeof value === "string" && value.trim() !== "") {
					conditions.push({
						email: {
							equals: value,
							mode: "insensitive",
						},
					});
				}
				break;

			case "userId":
				if (typeof value === "string" && value.trim() !== "") {
					conditions.push({ userId: value });
				}
				break;
		}
	});

	return conditions;
};
