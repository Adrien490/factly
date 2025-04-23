"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features/has-organization-access";
import db from "@/shared/lib/db";
import {
	ActionStatus,
	ServerAction,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types/server-action";
import { FiscalYear } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { createFiscalYearSchema } from "../schemas";

/**
 * Action serveur pour créer une nouvelle année fiscale
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - Les dates doivent être valides (début < fin)
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
				"Vous devez être connecté pour créer une année fiscale"
			);
		}

		// 2. Extraction des données du formulaire
		const organizationId = formData.get("organizationId") as string;
		if (!organizationId) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation est requis"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Préparation des données
		const rawData = {
			organizationId,
			name: formData.get("name") as string,
			description: formData.get("description") as string,
			startDate: formData.get("startDate") as string,
			endDate: formData.get("endDate") as string,
			status: formData.get("status") as string,
			isCurrent: formData.get("isCurrent") === "true",
		};

		// 5. Validation des données
		const validation = createFiscalYearSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs dans le formulaire"
			);
		}

		// 6. Si cette année est marquée comme courante, désactiver les autres
		if (validation.data.isCurrent) {
			await db.fiscalYear.updateMany({
				where: {
					organizationId: validation.data.organizationId,
					isCurrent: true,
				},
				data: {
					isCurrent: false,
				},
			});
		}

		// 7. Création de l'année fiscale
		const fiscalYear = await db.fiscalYear.create({
			data: validation.data,
		});

		// 8. Revalidation du cache
		revalidateTag(`organization:${organizationId}:fiscal-years`);

		// 9. Retour de la réponse
		return createSuccessResponse(
			fiscalYear,
			`L'année fiscale "${fiscalYear.name}" a été créée avec succès`
		);
	} catch (error) {
		console.error("[CREATE_FISCAL_YEAR]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de créer l'année fiscale"
		);
	}
};
