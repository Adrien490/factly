import { FiscalYearStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour le changement de statut d'une année fiscale
 */
export const changeFiscalYearStatusSchema = z.object({
	id: z.string().min(1, "L'ID de l'année fiscale est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
	status: z.nativeEnum(FiscalYearStatus, {
		required_error: "Le statut est requis",
		invalid_type_error: "Le statut n'est pas valide",
	}),
});

export type ChangeFiscalYearStatusInput = z.infer<
	typeof changeFiscalYearStatusSchema
>;
