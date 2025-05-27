import { FiscalYearStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour la mise à jour d'une année fiscale
 */
export const updateFiscalYearSchema = z
	.object({
		id: z.string().min(1, "L'ID de l'année fiscale est requis"),
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

export type UpdateFiscalYearInput = z.infer<typeof updateFiscalYearSchema>;
