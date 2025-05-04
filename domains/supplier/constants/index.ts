import { ADDRESS_TYPES } from "@/domains/address/constants";

export * from "./supplier-sort-fields";
export * from "./supplier-statuses";
export * from "./supplier-types";

export const supplierSortableFields = [
	"createdAt",
	"name",
	"email",
	"reference",
	"status",
	"supplierType",
] as const;

// Filtrer les types d'adresses pertinents pour les fournisseurs
export const SUPPLIER_ADDRESS_TYPES = ADDRESS_TYPES.filter((type) =>
	["BILLING", "HEADQUARTERS", "WAREHOUSE", "PRODUCTION", "COMMERCIAL"].includes(
		type.value
	)
);
