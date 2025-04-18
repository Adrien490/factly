"use server";

import { auth } from "@/domains/auth";
import db from "@/shared/lib/db";
import {
	ActionState,
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types/server-action";
import { Country, Organization } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { createOrganizationSchema } from "../schemas";

/**
 * Action serveur pour créer une nouvelle organisation
 * Validations :
 * - L'utilisateur doit être authentifié
 * - Le SIREN/SIRET doit être unique s'il est fourni
 */
export async function createOrganization(
	_: ActionState<Organization, typeof createOrganizationSchema> | null,
	formData: FormData
): Promise<ActionState<Organization, typeof createOrganizationSchema>> {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer une organisation"
			);
		}

		// 2. Préparation et transformation des données brutes
		const rawData = {
			name: formData.get("name") as string,
			legalName: formData.get("legalName") as string,
			legalForm: formData.get("legalForm") as string,
			email: formData.get("email") as string,
			phone: formData.get("phone") as string,
			website: formData.get("website") as string,
			siren:
				((formData.get("siren") as string) || "").trim() === ""
					? null
					: (formData.get("siren") as string),
			siret:
				((formData.get("siret") as string) || "").trim() === ""
					? null
					: (formData.get("siret") as string),
			vatNumber:
				((formData.get("vatNumber") as string) || "").trim() === ""
					? null
					: (formData.get("vatNumber") as string),
			addressLine1: formData.get("addressLine1") as string,
			addressLine2: formData.get("addressLine2") as string,
			postalCode: formData.get("postalCode") as string,
			city: formData.get("city") as string,
			country: formData.get("country") as Country,
			logoUrl: formData.get("logoUrl") as string,
			creatorId: session.user.id,
		};

		// 3. Validation des données avec le schéma Zod
		const validation = createOrganizationSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[CREATE_ORGANIZATION] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez remplir tous les champs obligatoires"
			);
		}

		// 4. Vérification de l'unicité du SIREN/SIRET s'ils sont fournis
		if (validation.data.siren) {
			const existingOrgBySiren = await db.organization.findFirst({
				where: { siren: validation.data.siren },
				select: { id: true },
			});

			if (existingOrgBySiren) {
				return createErrorResponse(
					ActionStatus.CONFLICT,
					"Une organisation avec ce SIREN existe déjà"
				);
			}
		}

		if (validation.data.siret) {
			const existingOrgBySiret = await db.organization.findFirst({
				where: { siret: validation.data.siret },
				select: { id: true },
			});

			if (existingOrgBySiret) {
				return createErrorResponse(
					ActionStatus.CONFLICT,
					"Une organisation avec ce SIRET existe déjà"
				);
			}
		}

		// Vérification de l'unicité du numéro de TVA s'il est fourni
		if (validation.data.vatNumber) {
			const existingOrgByVatNumber = await db.organization.findFirst({
				where: { vatNumber: validation.data.vatNumber },
				select: { id: true },
			});

			if (existingOrgByVatNumber) {
				return createErrorResponse(
					ActionStatus.CONFLICT,
					"Une organisation avec ce numéro de TVA existe déjà"
				);
			}
		}

		// 5. Création de l'organisation dans la base de données
		const { creatorId, ...dataWithoutCreatorId } = validation.data;

		const organization = await db.organization.create({
			data: {
				...dataWithoutCreatorId,
				// Relations
				creator: { connect: { id: creatorId } },
				members: {
					create: {
						user: { connect: { id: creatorId } },
					},
				},
			},
		});

		// Revalidation des tags de cache
		// Tag principal pour toutes les organisations
		revalidateTag("organizations");

		// 6. Retour de la réponse de succès
		return createSuccessResponse(
			organization,
			`L'organisation ${organization.name} a été créée avec succès`
		);
	} catch (error) {
		console.error("[CREATE_ORGANIZATION]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de créer l'organisation"
		);
	}
}
