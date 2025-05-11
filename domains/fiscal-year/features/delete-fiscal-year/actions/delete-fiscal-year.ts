"use server";

import { auth } from "@/domains/auth";
import db from "@/shared/lib/db";

import { hasOrganizationAccess } from "@/domains/organization/features";
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

		// 2. Vérification de base des données requises
		const rawData = {
			id: formData.get("id") as string,
			organizationId: formData.get("organizationId") as string,
		};

		console.log("[DELETE_FISCAL_YEAR] Form Data:", {
			id: rawData.id,
			organizationId: rawData.organizationId,
		});

		// Vérification que l'organizationId n'est pas vide
		if (!rawData.organizationId) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"L'ID de l'organisation est manquant"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(rawData.organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Validation complète des données
		const validation = deleteFiscalYearSchema.safeParse(rawData);

		if (!validation.success) {
			console.log(validation.error.flatten().fieldErrors);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre saisie."
			);
		}

		// 5. Vérification de l'existence de l'année fiscale
		const existingFiscalYear = await db.fiscalYear.findFirst({
			where: {
				id: validation.data.id,
				organizationId: validation.data.organizationId,
			},
			select: {
				id: true,
				status: true,
				name: true,
				isCurrent: true, // Récupérer si c'est l'année courante
			},
		});

		if (!existingFiscalYear) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Année fiscale introuvable"
			);
		}

		// 6. Vérifier si c'est la dernière année fiscale de l'organisation
		const fiscalYearsCount = await db.fiscalYear.count({
			where: {
				organizationId: validation.data.organizationId,
			},
		});

		if (fiscalYearsCount <= 1) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Impossible de supprimer la dernière année fiscale de l'organisation. Chaque organisation doit avoir au moins une année fiscale."
			);
		}

		// 7. Vérifier si c'est l'année fiscale courante
		if (existingFiscalYear.isCurrent) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Impossible de supprimer l'année fiscale courante. Veuillez d'abord définir une autre année fiscale comme courante."
			);
		}

		// 8. Suppression
		await db.fiscalYear.delete({
			where: { id: validation.data.id },
		});

		// Revalidation du cache avec les mêmes tags que get-fiscal-years
		revalidateTag(`organizations:${rawData.organizationId}:fiscal-years`);
		revalidateTag(
			`organizations:${rawData.organizationId}:fiscal-year:${existingFiscalYear.id}`
		);
		revalidateTag(`organizations:${rawData.organizationId}:fiscal-years:count`);

		return createSuccessResponse(
			null,
			`Année fiscale "${existingFiscalYear.name}" supprimée définitivement`
		);
	} catch (error) {
		console.error("[HARD_DELETE_FISCAL_YEAR]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Impossible de supprimer définitivement l'année fiscale"
		);
	}
};
