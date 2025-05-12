import {
	AddressType,
	BusinessSector,
	Civility,
	ClientStatus,
	ClientType,
	Country,
	EmployeeCount,
	LegalForm,
} from "@prisma/client";
import { z } from "zod";

export const createClientSchema = z
	.object({
		// Identifiants
		organizationId: z.string(),
		reference: z.string().optional(),
		clientType: z.nativeEnum(ClientType),
		status: z.nativeEnum(ClientStatus),
		notes: z.string().optional(),

		// Champs du contact
		contactCivility: z.nativeEnum(Civility).optional(),
		contactFirstName: z.string().optional(),
		contactLastName: z.string().optional(),
		contactFunction: z.string().optional(),
		contactEmail: z.string().optional(),
		contactPhoneNumber: z.string().optional(),
		contactMobileNumber: z.string().optional(),
		contactFaxNumber: z.string().optional(),
		contactWebsite: z.string().optional(),

		// Champs de l'entreprise (optionnels)
		companyName: z.string().optional().nullable(),
		companyLegalForm: z.nativeEnum(LegalForm).optional().nullable(),
		companyEmail: z.string().optional().nullable(),
		companySiren: z.string().optional().nullable(),
		companySiret: z.string().optional().nullable(),
		companyVatNumber: z.string().optional().nullable(),
		companyNafApeCode: z.string().optional().nullable(),
		companyCapital: z.string().optional().nullable(),
		companyRcs: z.string().optional().nullable(),
		companyBusinessSector: z.nativeEnum(BusinessSector).optional().nullable(),
		companyEmployeeCount: z.nativeEnum(EmployeeCount).optional().nullable(),

		// Adresse
		addressType: z.nativeEnum(AddressType),
		addressLine1: z.string().optional(),
		addressLine2: z.string().optional(),
		postalCode: z.string().optional(),
		city: z.string().optional(),
		country: z.nativeEnum(Country),
		latitude: z.number().optional().nullable(),
		longitude: z.number().optional().nullable(),
	})
	.superRefine((data, ctx) => {
		// Validation conditionnelle pour lastname si clientType est INDIVIDUAL
		if (data.clientType === ClientType.INDIVIDUAL && !data.contactLastName) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Le nom est obligatoire pour un client particulier",
				path: ["contactLastName"],
			});
		}

		// Validation conditionnelle pour companyName si clientType est COMPANY
		if (data.clientType === ClientType.COMPANY && !data.companyName) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"Le nom de l'entreprise est obligatoire pour un client entreprise",
				path: ["companyName"],
			});
		}
	});
