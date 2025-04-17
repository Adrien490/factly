import { updateSupplierSchema } from "@/domains/supplier/features/update-supplier/schemas";
import { z } from "zod";

export type FormValues = z.infer<typeof updateSupplierSchema>;

/**
 * Options de configuration de base pour TanStack Form
 */
export const formOpts = (supplier: FormValues) => {
	// Valeurs par défaut basées sur le fournisseur existant
	const defaultValues: FormValues = {
		id: supplier.id,
		organizationId: supplier.organizationId,
		name: supplier.name,
		legalName: supplier.legalName || "",
		email: supplier.email || "",
		phone: supplier.phone || "",
		website: supplier.website || "",
		notes: supplier.notes || "",
		supplierType: supplier.supplierType,
		status: supplier.status,
		siren: supplier.siren || "",
		siret: supplier.siret || "",
		vatNumber: supplier.vatNumber || "",
	};

	return {
		defaultValues,
	};
};
