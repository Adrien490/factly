import { SupplierStatus, SupplierType } from "@prisma/client";
import { z } from "zod";

export const updateSupplierSchema = z.object({
	id: z.string().min(1, "L'ID du fournisseur est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
	name: z.string().optional(),
	legalName: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	website: z.string().optional(),
	notes: z.string().optional(),
	supplierType: z.nativeEnum(SupplierType).optional(),
	status: z.nativeEnum(SupplierStatus).optional(),
	siren: z.string().optional(),
	siret: z.string().optional(),
	vatNumber: z.string().optional(),
});
