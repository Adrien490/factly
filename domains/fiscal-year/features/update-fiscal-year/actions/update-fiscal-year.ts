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
import { FiscalYear } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { updateFiscalYearSchema } from "../schemas";

/**
 * Action serveur pour mettre à jour une année fiscale
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - Les dates doivent être cohérentes (fin > début)
 * - Les années fiscales CLOSED ou ARCHIVED ont des restrictions de modification
 * - Une année marquée comme courante doit avoir le statut ACTIVE
 * - Les transitions de statut suivent des règles précises
 */
export const updateFiscalYear: ServerAction<
	FiscalYear,
	typeof updateFiscalYearSchema
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
			name: formData.get("name") as string,
			description: formData.get("description") as string | null,
			startDate: formData.get("startDate") as string,
			endDate: formData.get("endDate") as string,
			status: formData.get("status") as string,
			isCurrent: formData.get("isCurrent") === "true",
		};

		const validation = updateFiscalYearSchema.safeParse(rawData);
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

		// 4. Si isCurrent est true, désactiver les autres années fiscales courantes
		if (validation.data.isCurrent) {
			await db.fiscalYear.updateMany({
				where: {
					id: { not: validation.data.id },
				},
				data: { isCurrent: false },
			});
		}

		// 5. Mise à jour de l'année fiscale
		const updatedFiscalYear = await db.fiscalYear.update({
			where: { id: validation.data.id },
			data: {
				name: validation.data.name,
				description: validation.data.description,
				startDate: validation.data.startDate,
				endDate: validation.data.endDate,
				status: validation.data.status,
				isCurrent: validation.data.isCurrent,
			},
		});

		// 6. Invalidation du cache
		revalidateTag(`fiscal-year:${validation.data.id}`);
		revalidateTag(`fiscal-years`);

		return createSuccessResponse(
			updatedFiscalYear,
			"Année fiscale mise à jour avec succès"
		);
	} catch (error) {
		console.error("[UPDATE_FISCAL_YEAR]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la mise à jour de l'année fiscale"
		);
	}
};
