import { ClientStatus, ClientType, Prisma } from "@prisma/client";

/**
 * Construit les conditions de filtrage pour les clients
 */
export function buildFilterConditions(
	filters: Record<string, unknown>
): Prisma.ClientWhereInput[] {
	const conditions: Prisma.ClientWhereInput[] = [];

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
					conditions.push({
						status: {
							in: value.filter(
								(v): v is ClientStatus =>
									typeof v === "string" &&
									Object.values(ClientStatus).includes(v as ClientStatus)
							),
						},
					});
				}
				break;
			case "clientType":
				if (
					typeof value === "string" &&
					Object.values(ClientType).includes(value as ClientType)
				) {
					conditions.push({ type: value as ClientType });
				} else if (Array.isArray(value) && value.length > 0) {
					conditions.push({
						type: {
							in: value.filter(
								(v): v is ClientType =>
									typeof v === "string" &&
									Object.values(ClientType).includes(v as ClientType)
							),
						},
					});
				}
				break;
			default:
				break;
		}
	});

	return conditions;
}
