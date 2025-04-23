import { FiscalYearStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour la mise à jour d'une année fiscale
 */
export const updateFiscalYearSchema = z
	.object({
		id: z.string().min(1, "L'ID de l'année fiscale est requis"),
		organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
		name: z.string().min(1, "Le nom est requis").optional(),
		description: z.string().optional().nullable(),
		startDate: z.coerce
			.date({
				invalid_type_error: "La date de début n'est pas valide",
			})
			.optional(),
		endDate: z.coerce
			.date({
				invalid_type_error: "La date de fin n'est pas valide",
			})
			.optional(),
		status: z
			.nativeEnum(FiscalYearStatus, {
				invalid_type_error: "Le statut n'est pas valide",
			})
			.optional(),
		isCurrent: z.boolean().optional(),
	})
	.refine(
		(data) => {
			if (data.startDate && data.endDate) {
				return data.endDate > data.startDate;
			}
			return true;
		},
		{
			message: "La date de fin doit être postérieure à la date de début",
			path: ["endDate"],
		}
	);

export type UpdateFiscalYearInput = z.infer<typeof updateFiscalYearSchema>;
