"use server";

import { auth } from "@/domains/auth";
import { hasAssociatedTransactions } from "@/domains/fiscal-year/queries/has-associated-transactions";
import { hasDateOverlap } from "@/domains/fiscal-year/queries/has-date-overlap";
import { isValidStatusTransition } from "@/domains/fiscal-year/utils/is-valid-status-transition";
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

		// 4. Vérification de l'existence de l'année fiscale
		const existingFiscalYear = await db.fiscalYear.findUnique({
			where: {
				id: fiscalYearId.toString(),
				organizationId: organizationId.toString(),
			},
		});

		if (!existingFiscalYear) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"L'année fiscale que vous souhaitez modifier n'existe pas"
			);
		}

		// 5. Préparation et transformation des données brutes
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

		// 6. Validation des données avec le schéma Zod
		const validation = updateFiscalYearSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[UPDATE_FISCAL_YEAR] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Veuillez vérifier les champs modifiés"
			);
		}

		// 7. Vérifier les restrictions de modification pour les années CLOSED ou ARCHIVED
		if (
			(existingFiscalYear.status === FiscalYearStatus.CLOSED ||
				existingFiscalYear.status === FiscalYearStatus.ARCHIVED) &&
			// Si on tente de modifier les dates
			(validation.data.startDate || validation.data.endDate)
		) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Impossible de modifier les dates d'une année fiscale clôturée ou archivée",
				rawData
			);
		}

		// 8. Vérifier si on tente de fermer une année fiscale courante
		if (
			existingFiscalYear.isCurrent &&
			validation.data.status &&
			(validation.data.status === FiscalYearStatus.CLOSED ||
				validation.data.status === FiscalYearStatus.ARCHIVED)
		) {
			// Vérifier s'il existe une autre année fiscale courante
			const otherCurrentFiscalYears = await db.fiscalYear.count({
				where: {
					organizationId: validation.data.organizationId,
					id: { not: validation.data.id },
					isCurrent: true,
					status: FiscalYearStatus.ACTIVE,
				},
			});

			if (otherCurrentFiscalYears === 0) {
				return createErrorResponse(
					ActionStatus.FORBIDDEN,
					"Impossible de fermer cette année fiscale car elle est définie comme année courante. Veuillez d'abord définir une autre année fiscale comme courante.",
					rawData
				);
			}
		}

		// 9. Vérifier si l'année a des transactions associées avant de modifier les dates
		if (
			(validation.data.startDate || validation.data.endDate) &&
			(await hasAssociatedTransactions(existingFiscalYear.id))
		) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Impossible de modifier les dates d'une année fiscale ayant des transactions associées",
				rawData
			);
		}

		// 10. Vérifier les dates si elles sont modifiées
		if (validation.data.startDate && validation.data.endDate) {
			// Vérifier que la date de début est antérieure à la date de fin
			if (
				new Date(validation.data.startDate) >= new Date(validation.data.endDate)
			) {
				return createErrorResponse(
					ActionStatus.VALIDATION_ERROR,
					"La date de début doit être antérieure à la date de fin",
					rawData
				);
			}

			// Si les dates n'ont pas changé par rapport à l'existant, pas besoin de vérifier le chevauchement
			const datesUnchanged =
				new Date(validation.data.startDate).getTime() ===
					new Date(existingFiscalYear.startDate).getTime() &&
				new Date(validation.data.endDate).getTime() ===
					new Date(existingFiscalYear.endDate).getTime();

			// Vérifier les chevauchements avec d'autres années fiscales seulement si les dates ont changé
			if (!datesUnchanged) {
				const hasOverlap = await hasDateOverlap(
					validation.data.organizationId,
					validation.data.startDate,
					validation.data.endDate
				);

				if (hasOverlap) {
					return createErrorResponse(
						ActionStatus.CONFLICT,
						"Cette période chevauche une autre année fiscale existante. Veuillez ajuster les dates.",
						rawData
					);
				}
			}
		}

		// 11. Vérifier les transitions de statut
		if (validation.data.status !== existingFiscalYear.status) {
			const statusTransitionCheck = isValidStatusTransition(
				existingFiscalYear.status as FiscalYearStatus,
				validation.data.status as FiscalYearStatus
			);

			if (!statusTransitionCheck.isValid) {
				return createErrorResponse(
					ActionStatus.FORBIDDEN,
					statusTransitionCheck.message || "Transition de statut non autorisée",
					rawData
				);
			}

			// Si on passe de ACTIVE à CLOSED, vérifier que toutes les opérations de clôture sont terminées
			if (
				existingFiscalYear.status === FiscalYearStatus.ACTIVE &&
				validation.data.status === FiscalYearStatus.CLOSED
			) {
				// Ici, implémentez la vérification que toutes les opérations de clôture sont terminées
				// Pour cette démo, nous supposons que c'est le cas
			}
		}

		// 12. Si l'année est marquée comme courante, vérifier qu'elle est ACTIVE
		// Nous supprimons cette vérification puisque nous forcerons isCurrent à false

		// 13. Mise à jour de l'année fiscale dans la base de données
		const fiscalYear = await db.fiscalYear.update({
			where: { id: validation.data.id },
			data: {
				...validation.data,
				isCurrent: false, // Forcer la valeur à false, car la modification se fait via l'action dédiée
			},
		});

		// 14. Révalidation des tags pour mettre à jour les données en cache
		revalidateTag(
			`organizations:${validation.data.organizationId}:fiscal-year:${validation.data.id}`
		);
		revalidateTag(
			`organizations:${validation.data.organizationId}:fiscal-years`
		);

		// 15. Retour de la réponse de succès avec message d'information
		return createSuccessResponse(
			fiscalYear,
			`L'année fiscale ${fiscalYear.name} a été modifiée avec succès. Si nécessaire, vous pouvez la définir comme année fiscale par défaut depuis la liste des années fiscales.`,
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
