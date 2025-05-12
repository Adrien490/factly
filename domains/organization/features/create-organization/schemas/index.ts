import {
	BusinessSector,
	Country,
	EmployeeCount,
	LegalForm,
} from "@prisma/client";
import { z } from "zod";

const emptyToNull = (val: string) => (val === "" ? null : val);
const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
const mobileRegex = /^(?:(?:\+|00)33|0)\s*[67](?:[\s.-]*\d{2}){4}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRegex =
	/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

/**
 * Schéma de validation pour la création d'une organisation
 * Basé sur le modèle Prisma Organization
 */
export const createOrganizationSchema = z
	.object({
		// Informations de base
		companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
		legalForm: z.nativeEnum(LegalForm).optional().nullable(),
		logoUrl: z.string().optional().nullable(),

		// Contact
		email: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine((val) => !val || emailRegex.test(val), "Format d'email invalide"),

		phoneNumber: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || phoneRegex.test(val),
				"Format de numéro de téléphone invalide"
			),
		mobileNumber: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || mobileRegex.test(val),
				"Format de numéro de mobile invalide"
			),
		faxNumber: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || phoneRegex.test(val),
				"Format de numéro de fax invalide"
			),
		website: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine((val) => !val || urlRegex.test(val), "Format d'URL invalide"),

		// Informations de l'entreprise
		nafApeCode: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || /^\d{4}[A-Z]$/.test(val),
				"Le code NAF/APE doit être au format 4 chiffres suivis d'une lettre"
			),
		capital: z.string().optional().nullable(),
		rcs: z.string().optional().nullable(),
		businessSector: z.nativeEnum(BusinessSector).optional().nullable(),
		employeeCount: z.nativeEnum(EmployeeCount).optional().nullable(),

		// Informations fiscales
		siren: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || /^\d{9}$/.test(val),
				"Le numéro SIREN doit comporter exactement 9 chiffres"
			),
		siret: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || /^\d{14}$/.test(val),
				"Le numéro SIRET doit comporter exactement 14 chiffres"
			),
		vatNumber: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || /^FR\d{2}\d{9}$/.test(val),
				"Le numéro de TVA doit être au format FR + 2 chiffres + 9 chiffres"
			),

		// Adresse
		addressLine1: z.string().optional().nullable(),
		addressLine2: z.string().optional().nullable(),
		postalCode: z.string().optional().nullable(),
		city: z.string().optional().nullable(),
		country: z.nativeEnum(Country).default(Country.FRANCE),

		// Champs système
		userId: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		// Validation du SIRET si SIREN est fourni
		if (data.siren && !data.siret) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Le SIRET est requis si le SIREN est fourni",
				path: ["siret"],
			});
		}

		// Validation que le SIRET commence par le SIREN si les deux sont fournis
		if (data.siren && data.siret && !data.siret.startsWith(data.siren)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Le SIRET doit commencer par le SIREN",
				path: ["siret"],
			});
		}
	});
