import { FiscalYearStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour la création d'une année fiscale
 */
export const createFiscalYearSchema = z
	.object({
		organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
		name: z.string().min(1, "Le nom est requis"),
		description: z.string().optional().nullable(),
		startDate: z.coerce.date({
			required_error: "La date de début est requise",
			invalid_type_error: "La date de début n'est pas valide",
		}),
		endDate: z.coerce.date({
			required_error: "La date de fin est requise",
			invalid_type_error: "La date de fin n'est pas valide",
		}),
		status: z
			.nativeEnum(FiscalYearStatus, {
				required_error: "Le statut est requis",
				invalid_type_error: "Le statut n'est pas valide",
			})
			.default(FiscalYearStatus.ACTIVE),
		isCurrent: z.boolean().default(false),
	})
	.refine((data) => data.endDate > data.startDate, {
		message: "La date de fin doit être postérieure à la date de début",
		path: ["endDate"],
	});

export type CreateFiscalYearInput = z.infer<typeof createFiscalYearSchema>;
