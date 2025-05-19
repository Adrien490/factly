import {
	BusinessSector,
	Civility,
	EmployeeCount,
	LegalForm,
	SupplierStatus,
	SupplierType,
} from "@prisma/client";
import { z } from "zod";

export const updateSupplierSchema = z
	.object({
		// Identifiants
		id: z.string().min(1, "L'ID du fournisseur est requis"),
		organizationId: z.string().min(1, "L'organisation est obligatoire"),
		reference: z.string().optional(),
		type: z.nativeEnum(SupplierType).optional(),
		status: z.nativeEnum(SupplierStatus).optional(),

		// Champs du contact
		contactCivility: z
			.string()
			.transform((val) => (val === "" ? null : val))
			.pipe(z.nativeEnum(Civility).optional().nullable()),
		contactNotes: z.string().optional(),
		contactFirstName: z.string().optional(),
		contactLastName: z.string().optional(),
		contactFunction: z.string().optional(),
		contactEmail: z.string().email("Format d'email invalide").optional(),
		contactPhoneNumber: z.string().optional(),
		contactMobileNumber: z.string().optional(),
		contactFaxNumber: z.string().optional(),
		contactWebsite: z.string().url("Format d'URL invalide").optional(),

		// Champs de l'entreprise (optionnels)
		companyName: z.string().optional().nullable(),
		companyLegalForm: z.nativeEnum(LegalForm).optional().nullable(),
		companyEmail: z
			.string()
			.email("Format d'email invalide")
			.optional()
			.nullable(),
		companySiren: z
			.string()
			.length(9, "Le SIREN doit comporter 9 chiffres")
			.optional()
			.nullable(),
		companySiret: z
			.string()
			.length(14, "Le SIRET doit comporter 14 chiffres")
			.optional()
			.nullable(),
		companyVatNumber: z
			.string()
			.regex(/^FR\d{2}\d{9}$/, "Format de numéro de TVA invalide")
			.optional()
			.nullable(),
		companyNafApeCode: z
			.string()
			.regex(/^[0-9]{4}[A-Z]$/, "Format de code APE invalide")
			.optional()
			.nullable(),
		companyCapital: z.string().optional().nullable(),
		companyRcs: z.string().optional().nullable(),
		companyBusinessSector: z.nativeEnum(BusinessSector).optional().nullable(),
		companyEmployeeCount: z.nativeEnum(EmployeeCount).optional().nullable(),
	})
	.superRefine((data, ctx) => {
		// Validation conditionnelle pour lastname si supplierType est INDIVIDUAL
		if (data.type === SupplierType.INDIVIDUAL && !data.contactLastName) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Le nom est obligatoire pour un fournisseur particulier",
				path: ["contactLastName"],
			});
		}

		// Validation conditionnelle pour companyName si supplierType est COMPANY
		if (data.type === SupplierType.COMPANY && !data.companyName) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"Le nom de l'entreprise est obligatoire pour un fournisseur entreprise",
				path: ["companyName"],
			});
		}
	});
