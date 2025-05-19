import {
	BusinessSector,
	Civility,
	EmployeeCount,
	LegalForm,
	SupplierStatus,
	SupplierType,
} from "@prisma/client";
import { z } from "zod";

export const updateSupplierSchema = z.object({
	id: z.string().min(1, "L'ID du fournisseur est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
	reference: z.string().min(1, "La référence est requise"),
	type: z.nativeEnum(SupplierType),
	status: z.nativeEnum(SupplierStatus),

	// Informations de contact
	contactCivility: z.nativeEnum(Civility).nullable(),
	contactFirstName: z.string().optional(),
	contactLastName: z.string().min(1, "Le nom du contact est requis"),
	contactFunction: z.string().optional(),
	contactEmail: z.string().email("Format d'email invalide").optional(),
	contactPhoneNumber: z.string().optional(),
	contactMobileNumber: z.string().optional(),
	contactFaxNumber: z.string().optional(),
	contactWebsite: z.string().url("Format d'URL invalide").optional(),
	contactNotes: z.string().optional(),

	// Informations d'entreprise
	companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
	companyEmail: z.string().email("Format d'email invalide").optional(),
	companyLegalForm: z.nativeEnum(LegalForm),
	companySiren: z.string().length(9, "Le SIREN doit comporter 9 chiffres"),
	companySiret: z.string().length(14, "Le SIRET doit comporter 14 chiffres"),
	companyNafApeCode: z
		.string()
		.regex(/^[0-9]{4}[A-Z]$/, "Format de code APE invalide")
		.optional(),
	companyCapital: z.string().optional(),
	companyRcs: z.string().optional(),
	companyVatNumber: z
		.string()
		.regex(/^FR\d{2}\d{9}$/, "Format de numéro de TVA invalide")
		.optional(),
	companyBusinessSector: z.nativeEnum(BusinessSector).optional(),
	companyEmployeeCount: z.nativeEnum(EmployeeCount).optional(),
});
