// shared-code.ts
// Notice the import path is different from the client
import { ClientPriority, ClientStatus, ClientType } from "@prisma/client";
import { formOptions } from "@tanstack/react-form/nextjs";

// You can pass other form options here
const formOpts = (organizationId: string) =>
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
			priority: ClientPriority.MEDIUM as ClientPriority,
			notes: "",
			siren: "",
			siret: "",
			vatNumber: "",
			// Adresse principale
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

export default formOpts;
