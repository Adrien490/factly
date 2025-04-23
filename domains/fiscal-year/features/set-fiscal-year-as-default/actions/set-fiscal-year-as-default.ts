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
import { FiscalYearStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { setFiscalYearAsDefaultSchema } from "../schemas";

export const setFiscalYearAsDefault: ServerAction<
	null,
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

		// 2. Vérification de base des données requises
		const rawData = {
			id: formData.get("id") as string,
			organizationId: formData.get("organizationId") as string,
		};

		console.log("[SET_FISCAL_YEAR_AS_DEFAULT] Form Data:", {
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
		const validation = setFiscalYearAsDefaultSchema.safeParse(rawData);

		if (!validation.success) {
			console.log(validation.error.flatten().fieldErrors);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
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
				isCurrent: true,
			},
		});

		if (!existingFiscalYear) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Année fiscale introuvable"
			);
		}

		// 6. Vérifier que l'année fiscale est active
		if (existingFiscalYear.status !== FiscalYearStatus.ACTIVE) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Seule une année fiscale active peut être définie comme année par défaut"
			);
		}

		// 7. Vérifier si l'année est déjà l'année par défaut
		if (existingFiscalYear.isCurrent) {
			return createSuccessResponse(
				null,
				`L'année fiscale "${existingFiscalYear.name}" est déjà définie comme année par défaut`
			);
		}

		// 8. Désactiver l'année fiscale courante existante et définir la nouvelle comme défaut
		// Utiliser une transaction pour garantir l'atomicité de l'opération
		await db.$transaction(async (tx) => {
			// Désactiver toutes les autres années fiscales courantes
			await tx.fiscalYear.updateMany({
				where: {
					organizationId: validation.data.organizationId,
					isCurrent: true,
				},
				data: {
					isCurrent: false,
				},
			});

			// Définir la nouvelle année fiscale comme courante
			await tx.fiscalYear.update({
				where: { id: validation.data.id },
				data: { isCurrent: true },
			});
		});

		// Revalidation du cache
		revalidateTag(`organization:${rawData.organizationId}:fiscal-years`);
		revalidateTag(
			`organization:${rawData.organizationId}:fiscal-year:${existingFiscalYear.id}`
		);

		return createSuccessResponse(
			null,
			`L'année fiscale "${existingFiscalYear.name}" a été définie comme année par défaut`
		);
	} catch (error) {
		console.error("[SET_FISCAL_YEAR_AS_DEFAULT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Impossible de définir l'année fiscale comme année par défaut"
		);
	}
};
