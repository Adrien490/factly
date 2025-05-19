import { Prisma } from "@prisma/client";

/**
 * Sélection par défaut des champs pour un fournisseur
 * Optimisée pour correspondre exactement aux besoins de la vue détail
 */
export const GET_SUPPLIER_DEFAULT_SELECT = {
	id: true,
	organizationId: true,
	reference: true,
	supplierType: true,
	status: true,
	createdAt: true,
	updatedAt: true,
	company: true,
	addresses: true,
	contacts: true,
} as const satisfies Prisma.SupplierSelect;
