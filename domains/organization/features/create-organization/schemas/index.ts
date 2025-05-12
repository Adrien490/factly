import {
	BusinessSector,
	Country,
	EmployeeCount,
	LegalForm,
} from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour la création d'une organisation
 * Basé sur le modèle Prisma Organization
 */
export const createOrganizationSchema = z
	.object({
		// Informations de base
		companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
		legalForm: z.nativeEnum(LegalForm),
		logoUrl: z.string().optional(),

		// Contact
		email: z.string().optional(),
		phoneNumber: z.string().optional(),
		mobileNumber: z.string().optional(),
		faxNumber: z.string().optional(),
		website: z.string().optional(),

		// Informations de l'entreprise
		nafApeCode: z.string().optional(),
		capital: z.string().optional(),
		rcs: z.string().optional(),
		businessSector: z.nativeEnum(BusinessSector).optional(),
		employeeCount: z.nativeEnum(EmployeeCount).optional(),

		// Informations fiscales
		siren: z.string().optional(),
		siret: z.string().optional(),
		vatNumber: z.string().optional(),

		// Adresse
		addressLine1: z.string().optional(),
		addressLine2: z.string().optional(),
		postalCode: z.string().optional(),
		city: z.string().optional(),
		country: z.nativeEnum(Country).default(Country.FRANCE),
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
