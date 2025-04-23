"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import db from "@/shared/lib/db";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import { FiscalYear, FiscalYearStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { updateFiscalYearSchema } from "../schemas";

/**
 * Action serveur pour mettre à jour une année fiscale
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - Les dates doivent être cohérentes (fin > début)
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
				"Vous devez être connecté pour modifier une année fiscale"
			);
		}

		// 2. Vérification de base des données requises
		const organizationId = formData.get("organizationId");
		const fiscalYearId = formData.get("id");

		if (!organizationId || !fiscalYearId) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation et l'ID de l'année fiscale sont requis"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId.toString());
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Préparation et transformation des données brutes
		const rawData = {
			id: fiscalYearId.toString(),
			organizationId: organizationId.toString(),
			name: formData.get("name") as string,
			description: formData.get("description") as string,
			status: formData.get("status") as FiscalYearStatus,
			isCurrent: formData.get("isCurrent") === "true",
			startDate: formData.get("startDate")
				? new Date(formData.get("startDate") as string)
				: undefined,
			endDate: formData.get("endDate")
				? new Date(formData.get("endDate") as string)
				: undefined,
		};

		console.log("[UPDATE_FISCAL_YEAR] Raw data:", rawData);

		// 5. Validation des données avec le schéma Zod
		const validation = updateFiscalYearSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[UPDATE_FISCAL_YEAR] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez vérifier les champs modifiés"
			);
		}

		// 6. Vérification de l'existence de l'année fiscale
		const existingFiscalYear = await db.fiscalYear.findUnique({
			where: {
				id: validation.data.id,
				organizationId: validation.data.organizationId,
			},
		});

		if (!existingFiscalYear) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"L'année fiscale que vous souhaitez modifier n'existe pas",
				rawData
			);
		}

		// 7. Si isCurrent est true, désactiver les autres années fiscales en cours
		if (validation.data.isCurrent) {
			await db.fiscalYear.updateMany({
				where: {
					organizationId: validation.data.organizationId,
					id: {
						not: validation.data.id,
					},
					isCurrent: true,
				},
				data: {
					isCurrent: false,
				},
			});
		}

		// 8. Mise à jour de l'année fiscale dans la base de données
		const { ...fiscalYearData } = validation.data;

		const fiscalYear = await db.fiscalYear.update({
			where: { id: fiscalYearData.id },
			data: fiscalYearData,
		});

		// 9. Révalidation des tags pour mettre à jour les données en cache
		revalidateTag(
			`organization:${fiscalYearData.organizationId}:fiscal-year:${fiscalYearData.id}`
		);
		revalidateTag(`organization:${fiscalYearData.organizationId}:fiscal-years`);

		// 10. Retour de la réponse de succès
		return createSuccessResponse(
			fiscalYear,
			`L'année fiscale ${fiscalYear.name} a été modifiée avec succès`,
			rawData
		);
	} catch (error) {
		console.error("[UPDATE_FISCAL_YEAR]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de modifier l'année fiscale"
		);
	}
};
