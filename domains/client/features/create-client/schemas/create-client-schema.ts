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

const emptyToNull = (val: string) => (val === "" ? null : val);
const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
const mobileRegex = /^(?:(?:\+|00)33|0)\s*[67](?:[\s.-]*\d{2}){4}$/;
const urlRegex =
	/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

/**
 * Schéma de validation pour la création d'un client
 * Basé sur le modèle Prisma Client
 */
export const createClientSchema = z
	.object({
		// Identifiants
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
		civility: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || Object.values(Civility).includes(val as Civility),
				"Veuillez sélectionner une civilité valide"
			),
		firstName: z.string().optional().nullable(),
		lastName: z.string().optional().nullable(),
		contactFunction: z.string().optional().nullable(),
		email: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
				"Format d'email invalide"
			),
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

		// Champs de l'entreprise (optionnels)
		companyName: z.string().optional().nullable(),
		legalForm: z.nativeEnum(LegalForm).optional().nullable(),
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
		vatNumber: z
			.string()
			.transform(emptyToNull)
			.nullable()
			.refine(
				(val) => !val || /^FR\d{2}\d{9}$/.test(val),
				"Le numéro de TVA doit être au format FR + 2 chiffres + 9 chiffres"
			),
		businessSector: z.nativeEnum(BusinessSector).optional().nullable(),
		employeeCount: z.nativeEnum(EmployeeCount).optional().nullable(),

		// Adresse
		addressType: z.nativeEnum(AddressType),
		addressLine1: z.string().optional().nullable(),
		addressLine2: z.string().optional().nullable(),
		postalCode: z.string().optional().nullable(),
		city: z.string().optional().nullable(),
		country: z.nativeEnum(Country),
		latitude: z.number().nullable(),
		longitude: z.number().nullable(),
	})
	.superRefine((data, ctx) => {
		// Validation conditionnelle pour lastname si clientType est INDIVIDUAL
		if (data.clientType === ClientType.INDIVIDUAL && !data.lastName) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Le nom est obligatoire pour un client particulier",
				path: ["lastName"],
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
