"use server";

import { auth } from "@/domains/auth";
import db from "@/shared/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types/server-action";
import { Organization } from "@prisma/client";
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
	_: ServerActionState<Organization, typeof createOrganizationSchema>,
	formData: FormData
): Promise<ServerActionState<Organization, typeof createOrganizationSchema>> {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer une organisation"
			);
		}

		// 2. Préparation et transformation des données brutes
		const rawData = {
			name: formData.get("name") as string,
			legalName: formData.get("legalName") as string,
			legalForm: formData.get("legalForm") as string,
			email: formData.get("email") as string,
			phone: (formData.get("phone") as string) || null,
			website: (formData.get("website") as string) || null,
			siren: (formData.get("siren") as string)?.trim() || null,
			siret: (formData.get("siret") as string)?.trim() || null,
			vatNumber: (formData.get("vatNumber") as string)?.trim() || null,
			addressLine1: (formData.get("addressLine1") as string) || null,
			addressLine2: (formData.get("addressLine2") as string) || null,
			postalCode: (formData.get("postalCode") as string) || null,
			city: (formData.get("city") as string) || null,
			logoUrl: (formData.get("logoUrl") as string) || null,
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
					ServerActionStatus.CONFLICT,
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
					ServerActionStatus.CONFLICT,
					"Une organisation avec ce SIRET existe déjà"
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

		revalidateTag("organizations");

		// 6. Retour de la réponse de succès
		return createSuccessResponse(
			organization,
			`L'organisation ${organization.name} a été créée avec succès`
		);
	} catch (error) {
		console.error("[CREATE_ORGANIZATION]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de créer l'organisation"
		);
	}
}
