import { createAddressSchema } from "@/domains/address/features/create-address/schemas";
import { AddressType, Country } from "@prisma/client";
import { z } from "zod";

export type FormValues = z.infer<typeof createAddressSchema>;

/**
 * Options de configuration de base pour TanStack Form
 */
export const formOpts = (
	organizationId: string,
	clientId?: string,
	supplierId?: string
) => {
	// Valeurs par défaut
	const defaultValues: FormValues = {
		organizationId,
		addressType: AddressType.BILLING,
		addressLine1: "",
		addressLine2: "",
		postalCode: "",
		city: "",
		country: Country.FRANCE,
		isDefault: false,
		latitude: null,
		longitude: null,
		clientId: clientId || undefined,
		supplierId: supplierId || undefined,
	};

	return {
		defaultValues,
	};
};
