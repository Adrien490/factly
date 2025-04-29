"use server";

import { auth } from "@/domains/auth";
import { hasAssociatedTransactions } from "@/domains/fiscal-year/queries/has-associated-transactions";
import { isValidStatusTransition } from "@/domains/fiscal-year/utils/is-valid-status-transition";
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
import { changeFiscalYearStatusSchema } from "../schemas";

/**
 * Action serveur pour changer le statut d'une année fiscale
 * Validations:
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - La transition de statut doit être valide
 * - Des vérifications supplémentaires sont effectuées selon le statut cible
 */
export const changeFiscalYearStatus: ServerAction<
	FiscalYear,
	typeof changeFiscalYearStatusSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier le statut d'une année fiscale"
			);
		}

		// 2. Extraction des données du formulaire
		const fiscalYearId = formData.get("id") as string;
		const organizationId = formData.get("organizationId") as string;
		const newStatus = formData.get("status") as FiscalYearStatus;

		if (!fiscalYearId || !organizationId || !newStatus) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"L'ID de l'année fiscale, l'ID de l'organisation et le statut sont requis"
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
			id: fiscalYearId,
			organizationId,
			status: newStatus,
		};

		// 5. Validation des données
		const validation = changeFiscalYearStatusSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs dans le formulaire"
			);
		}

		// 6. Récupération de l'année fiscale existante
		const existingFiscalYear = await db.fiscalYear.findUnique({
			where: {
				id: fiscalYearId,
				organizationId,
			},
		});

		if (!existingFiscalYear) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"L'année fiscale n'existe pas",
				rawData
			);
		}

		// 7. Vérification des transitions de statut
		const statusTransitionCheck = isValidStatusTransition(
			existingFiscalYear.status,
			newStatus
		);

		if (!statusTransitionCheck.isValid) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				statusTransitionCheck.message || "Transition de statut non autorisée",
				rawData
			);
		}

		// 8. Vérifications spécifiques selon le statut cible
		if (newStatus === FiscalYearStatus.CLOSED) {
			// Vérifier si c'est l'année fiscale courante
			if (existingFiscalYear.isCurrent) {
				// Vérifier s'il existe une autre année fiscale qui pourrait devenir courante
				const otherActiveFiscalYear = await db.fiscalYear.findFirst({
					where: {
						organizationId,
						id: { not: fiscalYearId },
						status: FiscalYearStatus.ACTIVE,
					},
				});

				if (!otherActiveFiscalYear) {
					return createErrorResponse(
						ActionStatus.FORBIDDEN,
						"Impossible de clôturer l'année fiscale courante sans avoir au moins une autre année fiscale active",
						rawData
					);
				}
			}

			// Vérifier si toutes les opérations de clôture sont terminées
			// Pour cette démo, nous supposons que la vérification des transactions est suffisante
			const hasTransactions = await hasAssociatedTransactions(fiscalYearId);
			if (hasTransactions) {
				// Noter que ce n'est pas une erreur bloquante, mais un avertissement
				// L'utilisateur pourrait vouloir clôturer malgré les transactions existantes
				// On pourrait ajouter un champ pour forcer la clôture malgré les transactions
			}
		} else if (newStatus === FiscalYearStatus.ARCHIVED) {
			// Vérifier si l'année fiscale est clôturée depuis un certain temps
			// Pour cette démo, nous vérifions simplement qu'elle est bien CLOSED
			if (existingFiscalYear.status !== FiscalYearStatus.CLOSED) {
				return createErrorResponse(
					ActionStatus.FORBIDDEN,
					"Impossible d'archiver une année fiscale qui n'est pas clôturée",
					rawData
				);
			}
		}

		// 9. Mise à jour du statut en base de données
		const updatedFiscalYear = await db.fiscalYear.update({
			where: { id: fiscalYearId },
			data: {
				status: newStatus,
			},
		});

		// 10. Révalidation du cache
		revalidateTag(`organizations:${organizationId}:fiscal-years`);
		revalidateTag(
			`organizations:${organizationId}:fiscal-year:${fiscalYearId}`
		);

		// 11. Retour de la réponse
		let successMessage = `Le statut de l'année fiscale "${updatedFiscalYear.name}" a été modifié avec succès`;

		if (newStatus === FiscalYearStatus.CLOSED) {
			successMessage = `L'année fiscale "${updatedFiscalYear.name}" a été clôturée avec succès`;
		} else if (newStatus === FiscalYearStatus.ARCHIVED) {
			successMessage = `L'année fiscale "${updatedFiscalYear.name}" a été archivée avec succès`;
		} else if (newStatus === FiscalYearStatus.ACTIVE) {
			successMessage = `L'année fiscale "${updatedFiscalYear.name}" a été activée avec succès`;
		}

		return createSuccessResponse(updatedFiscalYear, successMessage, rawData);
	} catch (error) {
		console.error("[CHANGE_FISCAL_YEAR_STATUS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de modifier le statut de l'année fiscale"
		);
	}
};
