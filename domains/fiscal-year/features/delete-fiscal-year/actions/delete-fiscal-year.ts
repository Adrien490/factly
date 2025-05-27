"use server";

import { auth } from "@/domains/auth";
import db from "@/shared/lib/db";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { deleteFiscalYearSchema } from "../schemas";

export const deleteFiscalYear: ServerAction<
	null,
	typeof deleteFiscalYearSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour effectuer cette action"
			);
		}

		// 2. Récupération et validation des données
		const rawData = {
			id: formData.get("id") as string,
		};

		const validation = deleteFiscalYearSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier vos données."
			);
		}

		// 3. Vérification de l'existence de l'année fiscale
		const existingFiscalYear = await db.fiscalYear.findUnique({
			where: { id: validation.data.id },
		});

		if (!existingFiscalYear) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Année fiscale non trouvée"
			);
		}

		// 4. Vérification que l'année fiscale n'est pas courante
		if (existingFiscalYear.isCurrent) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"Impossible de supprimer l'année fiscale courante. Veuillez d'abord définir une autre année comme courante."
			);
		}

		// 5. Suppression de l'année fiscale
		await db.fiscalYear.delete({
			where: { id: validation.data.id },
		});

		// 6. Invalidation du cache
		revalidateTag(`fiscal-years`);
		revalidateTag(`fiscal-year:${existingFiscalYear.id}`);

		return createSuccessResponse(
			null,
			`L'année fiscale "${existingFiscalYear.name}" a été supprimée avec succès`
		);
	} catch (error) {
		console.error("[DELETE_FISCAL_YEAR]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la suppression de l'année fiscale"
		);
	}
};
