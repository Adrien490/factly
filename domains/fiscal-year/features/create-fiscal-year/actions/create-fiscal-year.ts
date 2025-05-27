"use server";

import { auth } from "@/domains/auth";
import { hasDateOverlap } from "@/domains/fiscal-year/queries/has-date-overlap";
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
import { hasDateGap } from "../queries/has-date-gap";
import { createFiscalYearSchema } from "../schemas";

/**
 * Action serveur pour créer une nouvelle année fiscale
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - Les dates doivent être valides (début < fin)
 * - Vérification de l'absence de chevauchement avec d'autres années fiscales
 * - Vérification de l'absence de "trous" entre années fiscales
 * - Si l'année est marquée comme courante, vérification qu'il n'existe pas d'autre année active
 */
export const createFiscalYear: ServerAction<
	FiscalYear,
	typeof createFiscalYearSchema
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
			name: formData.get("name") as string,
			description: formData.get("description") as string | null,
			startDate: formData.get("startDate") as string,
			endDate: formData.get("endDate") as string,
			status: formData.get("status") as string,
			isCurrent: formData.get("isCurrent") === "true",
		};

		const validation = createFiscalYearSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier vos données."
			);
		}

		const { name, description, startDate, endDate, isCurrent } =
			validation.data;

		// 3. Vérification des chevauchements de dates
		const hasOverlap = await hasDateOverlap(
			new Date(startDate),
			new Date(endDate)
		);
		if (hasOverlap) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"Les dates de cette année fiscale chevauchent avec une année fiscale existante"
			);
		}

		// 4. Vérification des écarts de dates
		const gapCheck = await hasDateGap(new Date(startDate), new Date(endDate));
		if (gapCheck.hasGap) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				`Il y a un écart de ${gapCheck.gapDays} jour(s) entre cette année fiscale et les années existantes`
			);
		}

		// 5. Si isCurrent est true, désactiver les autres années fiscales courantes
		if (isCurrent) {
			await db.fiscalYear.updateMany({
				data: { isCurrent: false },
			});
		}

		// 6. Création de l'année fiscale
		const fiscalYear = await db.fiscalYear.create({
			data: {
				name,
				description,
				startDate,
				endDate,
				status: validation.data.status,
				isCurrent,
			},
		});

		// 7. Invalidation du cache
		revalidateTag(`fiscal-years`);

		return createSuccessResponse(
			fiscalYear,
			"Année fiscale créée avec succès",
			{
				fiscalYearId: fiscalYear.id,
			}
		);
	} catch (error) {
		console.error("[CREATE_FISCAL_YEAR]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la création de l'année fiscale"
		);
	}
};
