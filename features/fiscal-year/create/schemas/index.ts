import { FiscalYearStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour le formulaire d'année fiscale
 * Basé sur le modèle Prisma FiscalYear
 */
export const createFiscalYearSchema = z
	.object({
		// Identifiants
		organizationId: z.string().min(1, "L'organisation est requise"),
		userId: z.string().min(1, "L'utilisateur est requis"),

		// Informations de base
		name: z.string().min(1, "Le nom est requis"),
		startDate: z.coerce.date({
			required_error: "La date de début est requise",
			invalid_type_error: "Format de date invalide",
		}),
		endDate: z.coerce.date({
			required_error: "La date de fin est requise",
			invalid_type_error: "Format de date invalide",
		}),

		// Statut
		status: z.nativeEnum(FiscalYearStatus).default(FiscalYearStatus.ACTIVE),

		// Notes
		notes: z.string().optional(),
	})
	.refine(
		(data) => {
			return data.startDate < data.endDate;
		},
		{
			message: "La date de fin doit être postérieure à la date de début",
			path: ["endDate"],
		}
	);
