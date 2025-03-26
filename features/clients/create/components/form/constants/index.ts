// shared-code.ts
// Notice the import path is different from the client
import { AddressType, ClientStatus, ClientType } from "@prisma/client";
import { formOptions } from "@tanstack/react-form/nextjs";

// You can pass other form options here
export const formOpts = (organizationId: string) =>
	formOptions({
		defaultValues: {
			organizationId,
			name: "",
			reference: "",
			email: "",
			phone: "",
			website: "",
			clientType: ClientType.INDIVIDUAL as ClientType,
			status: ClientStatus.LEAD as ClientStatus,
			notes: "",
			siren: "",
			siret: "",
			vatNumber: "",
			// Adresse principale
			addressType: AddressType.BILLING as AddressType,
			addressLine1: "",
			addressLine2: "",
			postalCode: "",
			city: "",
			country: "France",
			// Coordonnées géographiques
			latitude: null as number | null,
			longitude: null as number | null,
		},
	});
