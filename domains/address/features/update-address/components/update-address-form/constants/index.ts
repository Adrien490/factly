import { GetAddressReturn } from "@/domains/address/features/get-address/types";
import { updateAddressSchema } from "@/domains/address/features/update-address/schemas";
import { z } from "zod";

export type FormValues = z.infer<typeof updateAddressSchema>;

/**
 * Options de configuration de base pour TanStack Form
 */
export const formOpts = (address: GetAddressReturn, organizationId: string) => {
	// Valeurs par défaut basées sur l'adresse existante
	const defaultValues: FormValues = {
		id: address.id,
		organizationId,
		addressType: address.addressType,
		addressLine1: address.addressLine1,
		addressLine2: address.addressLine2 || "",
		postalCode: address.postalCode,
		city: address.city,
		country: address.country || "France",
		isDefault: address.isDefault,
		latitude: address.latitude,
		longitude: address.longitude,
		clientId: address.clientId,
		supplierId: address.supplierId,
	};

	return {
		defaultValues,
	};
};
