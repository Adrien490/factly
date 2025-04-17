import { sortOrderSchema } from "@/shared/schemas";
import { SupplierStatus, SupplierType } from "@prisma/client";
import { z } from "zod";

// Définition des valeurs possibles pour chaque type de filtre
const statusFilterSchema = z.union([
	z.nativeEnum(SupplierStatus),
	z.array(z.nativeEnum(SupplierStatus)),
]);

const typeFilterSchema = z.union([
	z.nativeEnum(SupplierType),
	z.array(z.nativeEnum(SupplierType)),
]);

const textFilterSchema = z.union([z.string(), z.array(z.string())]);

// Schéma strict des filtres de fournisseurs avec seulement les clés autorisées
const supplierFiltersSchema = z
	.object({
		status: statusFilterSchema.optional(),
		supplierType: typeFilterSchema.optional(),
		name: textFilterSchema.optional(),
		legalName: textFilterSchema.optional(),
		email: textFilterSchema.optional(),
		siret: textFilterSchema.optional(),
		siren: textFilterSchema.optional(),
	})
	.partial();

export const getSuppliersSchema = z.object({
	organizationId: z.string(),
	search: z.string().optional(),
	filters: supplierFiltersSchema.default({}),
	page: z.number().default(1),
	perPage: z.number().default(10),
	sortBy: z.string().default("createdAt"),
	sortOrder: sortOrderSchema.default("desc"),
});
