"use server";

import { auth } from "@/domains/auth";
import { hasDateOverlap } from "@/domains/fiscal-year/queries/has-date-overlap";
import { hasOrganizationAccess } from "@/domains/organization/features/has-organization-access";
import db from "@/shared/lib/db";
import {
	ActionStatus,
	ServerAction,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types/server-action";
import { FiscalYear, FiscalYearStatus } from "@prisma/client";
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
			isCurrent: formData.get("isCurrent") === "true",
		};

		console.log("rawData", rawData);

		// 5. Validation des données
		const validation = createFiscalYearSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Veuillez corriger les erreurs dans le formulaire"
			);
		}

		// 6. Vérification des dates
		if (
			new Date(validation.data.startDate) >= new Date(validation.data.endDate)
		) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"La date de début doit être antérieure à la date de fin",
				rawData
			);
		}

		// 7. Vérification des chevauchements avec d'autres années fiscales
		const startDate = new Date(validation.data.startDate);
		const endDate = new Date(validation.data.endDate);

		const hasOverlap = await hasDateOverlap(organizationId, startDate, endDate);
		if (hasOverlap) {
			return createErrorResponse(
				ActionStatus.CONFLICT,
				"Cette période chevauche une autre année fiscale existante. Veuillez ajuster les dates.",
				rawData
			);
		}

		// 8. Vérification des "trous" entre années fiscales (warning seulement)
		const gapCheck = await hasDateGap(organizationId, startDate, endDate);

		// 9. Vérification si c'est la première année fiscale (si oui, elle devient automatiquement courante)
		const fiscalYearsCount = await db.fiscalYear.count({
			where: { organizationId },
		});

		const shouldBeCurrent =
			fiscalYearsCount === 0 ? true : validation.data.isCurrent;

		// 10. Création de l'année fiscale (dans une transaction si nécessaire)
		let fiscalYear;

		if (shouldBeCurrent) {
			// Utilisation d'une transaction pour créer l'année fiscale et la définir comme courante
			fiscalYear = await db.$transaction(async (tx) => {
				// Créer d'abord l'année fiscale
				const newFiscalYear = await tx.fiscalYear.create({
					data: {
						...validation.data,
						isCurrent: false, // Temporairement non-courant
						status: FiscalYearStatus.ACTIVE, // Force le statut initial à ACTIVE
					},
				});

				// Ensuite, désactiver toutes les années fiscales courantes existantes
				await tx.fiscalYear.updateMany({
					where: {
						organizationId: validation.data.organizationId,
						isCurrent: true,
					},
					data: {
						isCurrent: false,
					},
				});

				// Enfin, définir la nouvelle année fiscale comme courante
				return tx.fiscalYear.update({
					where: { id: newFiscalYear.id },
					data: { isCurrent: true },
				});
			});
		} else {
			// Création simple sans modification du statut courant
			fiscalYear = await db.fiscalYear.create({
				data: {
					...validation.data,
					isCurrent: false, // Forcer la valeur isCurrent à false
					status: FiscalYearStatus.ACTIVE, // Force le statut initial à ACTIVE
				},
			});
		}

		// 11. Revalidation du cache
		revalidateTag(`organizations:${organizationId}:fiscal-years`);

		// 12. Retour de la réponse avec un warning si nécessaire
		let successMessage = `L'année fiscale "${fiscalYear.name}" a été créée avec succès`;
		if (gapCheck.hasGap && gapCheck.message) {
			successMessage += `. Attention: ${gapCheck.message}`;
		}

		// Ajout d'un message pour inviter l'utilisateur à définir cette année comme année par défaut
		successMessage += `. Vous pouvez la définir comme année fiscale par défaut depuis la liste des années fiscales.`;

		return createSuccessResponse(fiscalYear, successMessage);
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
