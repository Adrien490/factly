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

/**
 * Schéma de validation pour le formulaire client
 * Basé sur le modèle Prisma Client
 */
export const createClientSchema = z
	.object({
		// Identifiants
		organizationId: z.string().min(1, "L'organisation est requise"),
		reference: z
			.string()
			.min(3, "La référence doit comporter au moins 3 caractères"),
		clientType: z.nativeEnum(ClientType),
		status: z.nativeEnum(ClientStatus),
		notes: z.string().optional(),

		// Informations de contact
		civility: z.nativeEnum(Civility).optional(),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
		contactFunction: z.string().optional(),
		email: z.string().email("Format d'email invalide").optional(),
		phoneNumber: z
			.string()
			.regex(
				/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
				"Format de numéro de téléphone invalide"
			)
			.optional(),
		mobileNumber: z
			.string()
			.regex(
				/^(?:(?:\+|00)33|0)\s*[67](?:[\s.-]*\d{2}){4}$/,
				"Format de numéro de mobile invalide"
			)
			.optional(),
		faxNumber: z
			.string()
			.regex(
				/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
				"Format de numéro de fax invalide"
			)
			.optional(),
		website: z.string().url("Format d'URL invalide").optional(),

		// Informations d'entreprise
		companyName: z.string().optional(),
		legalForm: z.nativeEnum(LegalForm).optional(),
		sirenNumber: z
			.string()
			.regex(/^\d{9}$/, "Le numéro SIREN doit comporter exactement 9 chiffres")
			.optional(),
		siretNumber: z
			.string()
			.regex(
				/^\d{14}$/,
				"Le numéro SIRET doit comporter exactement 14 chiffres"
			)
			.optional(),
		nafApeCode: z
			.string()
			.regex(
				/^[0-9]{4}[A-Z]$/,
				"Le code APE doit être au format 4 chiffres + 1 lettre"
			)
			.optional(),
		capital: z
			.string()
			.regex(
				/^\d+(?:[.,]\d{1,2})?$/,
				"Le capital doit être un nombre avec maximum 2 décimales"
			)
			.optional(),
		rcs: z
			.string()
			.regex(
				/^[A-Z]\d{8}$/,
				"Le numéro RCS doit commencer par une lettre suivie de 8 chiffres"
			)
			.optional(),
		vatNumber: z
			.string()
			.regex(
				/^FR\d{2}\d{9}$/,
				"Le numéro de TVA doit être au format FR + 2 chiffres + 9 chiffres"
			)
			.optional(),
		businessSector: z.nativeEnum(BusinessSector).optional(),
		employeeCount: z.nativeEnum(EmployeeCount).optional(),

		// Informations d'adresse
		addressType: z.nativeEnum(AddressType),
		addressLine1: z.string().optional(),
		addressLine2: z.string().optional(),
		postalCode: z.string().optional(),
		city: z.string().optional(),
		country: z.nativeEnum(Country).default(Country.FRANCE).optional(),
		latitude: z.number().nullable().optional(),
		longitude: z.number().nullable().optional(),
	})
	.refine(
		(data) => {
			if (data.clientType === ClientType.COMPANY) {
				return (
					!!data.companyName &&
					!!data.legalForm &&
					!!data.sirenNumber &&
					!!data.siretNumber &&
					!!data.businessSector &&
					!!data.employeeCount
				);
			}
			return true;
		},
		{
			message:
				"Les informations d'entreprise sont requises pour un client de type entreprise",
			path: ["companyName"],
		}
	);
