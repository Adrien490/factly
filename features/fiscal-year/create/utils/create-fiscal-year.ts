"use server";

import { auth } from "@/features/auth/lib/auth";
import { hasOrganizationAccess } from "@/features/organization/has-access";
import db from "@/shared/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types/server-action";
import { FiscalYear, FiscalYearStatus } from "@prisma/client";
import { headers } from "next/headers";
import { createFiscalYearSchema } from "../schemas";

/**
 * Action serveur pour créer une nouvelle année fiscale
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - Les dates de début et de fin doivent être cohérentes
 */
export async function createFiscalYear(
	_: ServerActionState<FiscalYear, typeof createFiscalYearSchema>,
	formData: FormData
): Promise<ServerActionState<FiscalYear, typeof createFiscalYearSchema>> {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer une année fiscale"
			);
		}

		// 2. Vérification de base des données requises
		const organizationId = formData.get("organizationId");
		if (!organizationId) {
			return createErrorResponse(
				ServerActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation est requis"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId.toString());
		if (!hasAccess) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Préparation et transformation des données brutes
		const rawData = {
			organizationId: organizationId.toString(),
			name: formData.get("name") as string,
			startDate: formData.get("startDate") as string,
			endDate: formData.get("endDate") as string,
			status:
				(formData.get("status") as FiscalYearStatus) || FiscalYearStatus.ACTIVE,
			notes: formData.get("notes") as string,
			userId: session.user.id,
		};

		// 5. Validation des données avec le schéma Zod
		const validation = createFiscalYearSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[CREATE_FISCAL_YEAR] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez remplir tous les champs obligatoires"
			);
		}

		// 6. Vérification de chevauchement avec d'autres années fiscales
		const overlappingFiscalYear = await db.fiscalYear.findFirst({
			where: {
				organizationId: validation.data.organizationId,
				OR: [
					{
						// Nouvelle année commence pendant une année existante
						startDate: { lte: validation.data.startDate },
						endDate: { gte: validation.data.startDate },
					},
					{
						// Nouvelle année se termine pendant une année existante
						startDate: { lte: validation.data.endDate },
						endDate: { gte: validation.data.endDate },
					},
					{
						// Nouvelle année englobe complètement une année existante
						startDate: { gte: validation.data.startDate },
						endDate: { lte: validation.data.endDate },
					},
				],
			},
			select: { id: true, name: true },
		});

		if (overlappingFiscalYear) {
			return createErrorResponse(
				ServerActionStatus.CONFLICT,
				`Cette période chevauche l'année fiscale "${overlappingFiscalYear.name}"`
			);
		}

		// 7. Création de l'année fiscale dans la base de données
		const fiscalYearData = validation.data;

		// Créer l'année fiscale avec les relations appropriées
		const fiscalYear = await db.fiscalYear.create({
			data: fiscalYearData,
		});

		// 8. Retour de la réponse de succès
		return createSuccessResponse(
			fiscalYear,
			`L'année fiscale ${fiscalYear.name} a été créée avec succès`
		);
	} catch (error) {
		console.error("[CREATE_FISCAL_YEAR]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de créer l'année fiscale"
		);
	}
}
