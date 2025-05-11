import {
	BusinessSector,
	Civility,
	ClientStatus,
	ClientType,
	EmployeeCount,
	LegalForm,
} from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour la mise à jour d'un client
 * Basé sur le modèle Prisma Client
 */
export const updateClientSchema = z
	.object({
		// Identifiants
		id: z.string(),
		organizationId: z.string(),
		reference: z
			.string()
			.min(3, "La référence doit comporter au moins 3 caractères"),
		clientType: z.nativeEnum(ClientType).optional(),
		status: z.nativeEnum(ClientStatus).optional(),
		notes: z.string().optional().nullable(),

		// Champs du contact
		civility: z.nativeEnum(Civility).optional().nullable(),
		firstName: z.string().optional().nullable(),
		lastName: z.string().optional().nullable(),
		contactFunction: z.string().optional().nullable(),
		email: z.string().email("Format d'email invalide").optional().nullable(),
		phoneNumber: z
			.string()
			.regex(
				/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
				"Format de numéro de téléphone invalide"
			)
			.optional()
			.nullable()
			.transform((val) => (val === "" ? null : val)),
		mobileNumber: z
			.string()
			.regex(
				/^(?:(?:\+|00)33|0)\s*[67](?:[\s.-]*\d{2}){4}$/,
				"Format de numéro de mobile invalide"
			)
			.optional()
			.nullable()
			.transform((val) => (val === "" ? null : val)),
		faxNumber: z
			.string()
			.regex(
				/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
				"Format de numéro de fax invalide"
			)
			.optional()
			.nullable()
			.transform((val) => (val === "" ? null : val)),
		website: z
			.string()
			.url("Format d'URL invalide")
			.optional()
			.nullable()
			.transform((val) => (val === "" ? null : val)),

		// Champs de l'entreprise (optionnels)
		companyName: z.string().optional().nullable(),
		legalForm: z.nativeEnum(LegalForm).optional().nullable(),
		siren: z
			.string()
			.regex(/^\d{9}$/, "Le numéro SIREN doit comporter exactement 9 chiffres")
			.optional()
			.nullable()
			.transform((val) => (val === "" ? null : val)),
		siret: z
			.string()
			.regex(
				/^\d{14}$/,
				"Le numéro SIRET doit comporter exactement 14 chiffres"
			)
			.optional()
			.nullable()
			.transform((val) => (val === "" ? null : val)),
		nafApeCode: z
			.string()
			.regex(
				/^\d{4}[A-Z]$/,
				"Le code NAF/APE doit être au format 4 chiffres suivis d'une lettre"
			)
			.optional()
			.nullable()
			.transform((val) => (val === "" ? null : val)),
		capital: z.string().optional().nullable(),
		rcs: z.string().optional().nullable(),
		vatNumber: z
			.string()
			.regex(
				/^FR\d{2}\d{9}$/,
				"Le numéro de TVA doit être au format FR + 2 chiffres + 9 chiffres"
			)
			.optional()
			.nullable()
			.transform((val) => (val === "" ? null : val)),
		businessSector: z.nativeEnum(BusinessSector).optional().nullable(),
		employeeCount: z.nativeEnum(EmployeeCount).optional().nullable(),
	})
	.refine(
		(data) => {
			if (data.clientType === ClientType.INDIVIDUAL) {
				return !!data.lastName;
			}
			return true;
		},
		{
			message: "Le nom est requis pour un client particulier",
			path: ["lastName"],
		}
	)
	.refine(
		(data) => {
			if (data.clientType === ClientType.COMPANY) {
				return !!data.companyName;
			}
			return true;
		},
		{
			message: "Le nom de l'entreprise est requis pour un client entreprise",
			path: ["companyName"],
		}
	);

export type UpdateClientSchema = z.infer<typeof updateClientSchema>;
