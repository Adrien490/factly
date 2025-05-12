import {
	EMAIL_REGEX,
	MOBILE_REGEX,
	PHONE_REGEX,
} from "@/shared/constants/regex";
import { emptyToNull } from "@/shared/utils";
import {
	BusinessSector,
	Country,
	EmployeeCount,
	LegalForm,
} from "@prisma/client";
import { z } from "zod";

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
		legalForm: z
			.string()
			.transform(emptyToNull)
			.pipe(z.nativeEnum(LegalForm).optional()),
		logoUrl: z.string().transform(emptyToNull).optional(),

		// Contact
		email: z
			.string()
			.transform(emptyToNull)
			.refine((val) => !val || EMAIL_REGEX.test(val), "Format d'email invalide")
			.optional(),

		phoneNumber: z
			.string()
			.transform(emptyToNull)
			.refine(
				(val) => !val || PHONE_REGEX.test(val),
				"Format de numéro de téléphone invalide"
			)
			.optional(),

		mobileNumber: z
			.string()
			.transform(emptyToNull)
			.refine(
				(val) => !val || MOBILE_REGEX.test(val),
				"Format de numéro de mobile invalide"
			)
			.optional(),

		faxNumber: z
			.string()
			.transform(emptyToNull)
			.refine(
				(val) => !val || PHONE_REGEX.test(val),
				"Format de numéro de fax invalide"
			)
			.optional(),

		website: z
			.string()
			.transform(emptyToNull)
			.refine((val) => !val || urlRegex.test(val), "Format d'URL invalide")
			.optional(),

		// Informations de l'entreprise
		nafApeCode: z
			.string()
			.transform(emptyToNull)
			.refine(
				(val) => !val || /^\d{4}[A-Z]$/.test(val),
				"Le code NAF/APE doit être au format 4 chiffres suivis d'une lettre"
			)
			.optional(),

		capital: z.string().transform(emptyToNull).optional(),
		rcs: z.string().transform(emptyToNull).optional(),
		businessSector: z
			.nativeEnum(BusinessSector)
			.transform(emptyToNull)
			.optional(),
		employeeCount: z
			.nativeEnum(EmployeeCount)
			.transform(emptyToNull)
			.optional(),

		// Informations fiscales
		siren: z
			.string()
			.transform(emptyToNull)
			.refine(
				(val) => !val || /^\d{9}$/.test(val),
				"Le numéro SIREN doit comporter exactement 9 chiffres"
			)
			.optional(),

		siret: z
			.string()
			.transform(emptyToNull)
			.refine(
				(val) => !val || /^\d{14}$/.test(val),
				"Le numéro SIRET doit comporter exactement 14 chiffres"
			)
			.optional(),

		vatNumber: z
			.string()
			.transform(emptyToNull)
			.refine(
				(val) => !val || /^FR\d{2}\d{9}$/.test(val),
				"Le numéro de TVA doit être au format FR + 2 chiffres + 9 chiffres"
			)
			.optional(),

		// Adresse
		addressLine1: z.string().transform(emptyToNull).optional(),
		addressLine2: z.string().transform(emptyToNull).optional(),
		postalCode: z.string().transform(emptyToNull).optional(),
		city: z.string().transform(emptyToNull).optional(),
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
	});
