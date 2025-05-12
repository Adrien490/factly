import { MOBILE_REGEX, PHONE_REGEX, URL_REGEX } from "@/shared/constants/regex";
import {
	BusinessSector,
	Civility,
	ClientStatus,
	ClientType,
	EmployeeCount,
	LegalForm,
} from "@prisma/client";
import { z } from "zod";

const emptyToNull = (val: string) => (val === "" ? null : val);

export const updateClientSchema = z
	.object({
		// Identifiants
		id: z.string(),
		organizationId: z.string(),
		reference: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || val.length >= 3,
				"La référence doit contenir au moins 3 caractères"
			),
		clientType: z.nativeEnum(ClientType),
		status: z.nativeEnum(ClientStatus),
		notes: z.string().optional().nullable(),

		// Champs du contact
		contactCivility: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || Object.values(Civility).includes(val as Civility),
				"Veuillez sélectionner une civilité valide"
			),
		contactFirstName: z.string().optional().nullable(),
		contactLastName: z.string().optional().nullable(),
		contactFunction: z.string().optional().nullable(),
		contactEmail: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
				"Format d'email invalide"
			),
		contactPhoneNumber: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || PHONE_REGEX.test(val),
				"Format de numéro de téléphone invalide"
			),
		contactMobileNumber: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || MOBILE_REGEX.test(val),
				"Format de numéro de mobile invalide"
			),
		contactFaxNumber: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || PHONE_REGEX.test(val),
				"Format de numéro de fax invalide"
			),
		contactWebsite: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine((val) => !val || URL_REGEX.test(val), "Format d'URL invalide"),

		// Champs de l'entreprise (optionnels)
		companyName: z.string().optional().nullable(),
		companyLegalForm: z.nativeEnum(LegalForm).optional().nullable(),
		companySiren: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || /^\d{9}$/.test(val),
				"Le numéro SIREN doit comporter exactement 9 chiffres"
			),
		companySiret: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || /^\d{14}$/.test(val),
				"Le numéro SIRET doit comporter exactement 14 chiffres"
			),
		companyEmail: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
				"Format d'email invalide"
			),
		companyNafApeCode: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || /^\d{4}[A-Z]$/.test(val),
				"Le code NAF/APE doit être au format 4 chiffres suivis d'une lettre"
			),
		companyCapital: z.string().optional().nullable(),
		companyRcs: z.string().optional().nullable(),
		companyVatNumber: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || /^FR\d{2}\d{9}$/.test(val),
				"Le numéro de TVA doit être au format FR + 2 chiffres + 9 chiffres"
			),
		companyBusinessSector: z.nativeEnum(BusinessSector).optional().nullable(),
		companyEmployeeCount: z.nativeEnum(EmployeeCount).optional().nullable(),
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

export type UpdateClientSchema = z.infer<typeof updateClientSchema>;
