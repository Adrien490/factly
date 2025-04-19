import { Prisma, SupplierStatus, SupplierType } from "@prisma/client";

/**
 * Construit les conditions de filtrage pour les fournisseurs
 */
export function buildFilterConditions(
	filters: Record<string, unknown>
): Prisma.SupplierWhereInput[] {
	const conditions: Prisma.SupplierWhereInput[] = [];

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
					conditions.push({
						status: {
							in: value.filter(
								(v): v is SupplierStatus =>
									typeof v === "string" &&
									Object.values(SupplierStatus).includes(v as SupplierStatus)
							),
						},
					});
				}
				break;
			case "supplierType":
				if (
					typeof value === "string" &&
					Object.values(SupplierType).includes(value as SupplierType)
				) {
					conditions.push({ supplierType: value as SupplierType });
				} else if (Array.isArray(value) && value.length > 0) {
					conditions.push({
						supplierType: {
							in: value.filter(
								(v): v is SupplierType =>
									typeof v === "string" &&
									Object.values(SupplierType).includes(v as SupplierType)
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
