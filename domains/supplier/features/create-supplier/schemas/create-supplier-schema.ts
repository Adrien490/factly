import {
	AddressType,
	BusinessSector,
	Civility,
	Country,
	EmployeeCount,
	LegalForm,
	SupplierStatus,
	SupplierType,
} from "@prisma/client";
import { z } from "zod";

export const createSupplierSchema = z
	.object({
		// Identifiants
		organizationId: z.string(),
		reference: z.string(),
		type: z.nativeEnum(SupplierType),
		status: z.nativeEnum(SupplierStatus),

		// Champs du contact
		contactCivility: z
			.string()
			.transform((val) => (val === "" ? null : val))
			.pipe(z.nativeEnum(Civility).optional().nullable()),
		contactNotes: z.string().optional(),
		contactFirstName: z.string().optional(),
		contactLastName: z.string().optional(),
		contactFunction: z.string().optional(),
		contactEmail: z.string().optional(),
		contactPhoneNumber: z.string().optional(),
		contactMobileNumber: z.string().optional(),
		contactFaxNumber: z.string().optional(),
		contactWebsite: z.string().optional(),

		// Champs de l'entreprise
		companyName: z.string(),
		companyLegalForm: z.nativeEnum(LegalForm),
		companyEmail: z.string().optional().nullable(),
		companySiren: z.string(),
		companySiret: z.string(),
		companyNafApeCode: z.string().optional().nullable(),
		companyCapital: z.string().optional().nullable(),
		companyRcs: z.string().optional().nullable(),
		companyVatNumber: z.string().optional().nullable(),
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
		// Validation conditionnelle pour lastname
		if (!data.contactLastName) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Le nom est obligatoire pour le contact",
				path: ["contactLastName"],
			});
		}

		// Validation conditionnelle pour companyName
		if (!data.companyName) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Le nom de l'entreprise est obligatoire",
				path: ["companyName"],
			});
		}
	});
