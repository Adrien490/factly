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
import { setFiscalYearAsDefaultSchema } from "../schemas";

export const setFiscalYearAsDefault: ServerAction<
	FiscalYear,
	typeof setFiscalYearAsDefaultSchema
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

		const validation = setFiscalYearAsDefaultSchema.safeParse(rawData);
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

		// 4. Si l'année fiscale est déjà courante, pas besoin de faire quoi que ce soit
		if (existingFiscalYear.isCurrent) {
			return createSuccessResponse(
				existingFiscalYear,
				"Cette année fiscale est déjà définie comme courante"
			);
		}

		// 5. Transaction pour définir l'année fiscale comme courante
		const updatedFiscalYear = await db.$transaction(async (tx) => {
			// Désactiver toutes les autres années fiscales courantes
			await tx.fiscalYear.updateMany({
				where: {
					id: { not: validation.data.id },
					isCurrent: true,
				},
				data: { isCurrent: false },
			});

			// Définir cette année fiscale comme courante
			return tx.fiscalYear.update({
				where: { id: validation.data.id },
				data: { isCurrent: true },
			});
		});

		// 6. Invalidation du cache
		revalidateTag(`fiscal-years`);
		revalidateTag(`fiscal-year:${existingFiscalYear.id}`);

		return createSuccessResponse(
			updatedFiscalYear,
			`L'année fiscale "${updatedFiscalYear.name}" a été définie comme année courante`
		);
	} catch (error) {
		console.error("[SET_FISCAL_YEAR_AS_DEFAULT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la définition de l'année fiscale par défaut"
		);
	}
};
