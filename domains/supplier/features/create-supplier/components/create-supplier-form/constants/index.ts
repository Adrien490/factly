import { createSupplierSchema } from "@/domains/supplier/features/create-supplier/schemas";
import { AddressType, SupplierStatus, SupplierType } from "@prisma/client";
import { z } from "zod";

/**
 * Options pour le formulaire TanStack Form
 */
export const formOpts = (organizationId: string) => ({
	defaultValues: {
		organizationId,
		name: "",
		legalName: "",
		email: "",
		phone: "",
		website: "",
		siren: "",
		siret: "",
		vatNumber: "",
		supplierType: SupplierType.MANUFACTURER,
		status: SupplierStatus.ACTIVE,
		notes: "",
		addressType: AddressType.BILLING,
		addressLine1: "",
		addressLine2: "",
		postalCode: "",
		city: "",
		country: "France",
		latitude: null as number | null,
		longitude: null as number | null,
	},
	onSubmit: async () => {
		// FormData est soumis via l'action serveur avec dispatch
		// Pas besoin de logique de soumission ici
	},
});

/**
 * Type des valeurs du formulaire
 */
export type FormValues = z.infer<typeof createSupplierSchema>;
