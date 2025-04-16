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
import { hasOrganizationAccess } from "../../has-organization-access";
import { updateOrganizationSchema } from "../schemas";

/**
 * Action serveur pour mettre à jour une organisation
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - Le SIREN/SIRET doit être unique s'il est modifié
 */
export async function updateOrganization(
	_: ServerActionState<Organization, typeof updateOrganizationSchema>,
	formData: FormData
): Promise<ServerActionState<Organization, typeof updateOrganizationSchema>> {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier une organisation"
			);
		}

		// 2. Vérification de base des données requises
		const organizationId = formData.get("id");
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
			id: organizationId.toString(),
			name: formData.get("name") as string,
			legalName: formData.get("legalName") as string,
			legalForm: formData.get("legalForm") as string,
			email: formData.get("email") as string,
			phone: formData.get("phone") as string,
			website: formData.get("website") as string,
			siren: formData.get("siren") as string,
			siret: formData.get("siret") as string,
			vatNumber: formData.get("vatNumber") as string,
			addressLine1: formData.get("addressLine1") as string,
			addressLine2: formData.get("addressLine2") as string,
			postalCode: formData.get("postalCode") as string,
			city: formData.get("city") as string,
			country: (formData.get("country") as string) || "France",
			logoUrl: formData.get("logoUrl") as string,
		};

		// 5. Validation des données avec le schéma Zod
		const validation = updateOrganizationSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[UPDATE_ORGANIZATION] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez remplir tous les champs obligatoires"
			);
		}

		// 6. Vérification de l'unicité du SIREN/SIRET s'ils sont fournis
		if (validation.data.siren) {
			const existingOrgBySiren = await db.organization.findFirst({
				where: {
					siren: validation.data.siren,
					id: { not: validation.data.id },
				},
				select: { id: true },
			});

			if (existingOrgBySiren) {
				return createErrorResponse(
					ServerActionStatus.CONFLICT,
					"Une autre organisation avec ce SIREN existe déjà"
				);
			}
		}

		if (validation.data.siret) {
			const existingOrgBySiret = await db.organization.findFirst({
				where: {
					siret: validation.data.siret,
					id: { not: validation.data.id },
				},
				select: { id: true },
			});

			if (existingOrgBySiret) {
				return createErrorResponse(
					ServerActionStatus.CONFLICT,
					"Une autre organisation avec ce SIRET existe déjà"
				);
			}
		}

		// 7. Mise à jour de l'organisation dans la base de données
		const { id, ...updateData } = validation.data;

		const organization = await db.organization.update({
			where: { id },
			data: updateData,
		});

		// Revalidation des tags de cache
		// Tag principal pour toutes les organisations
		revalidateTag("organizations");

		// Tag spécifique pour l'utilisateur actuel
		revalidateTag(`organizations:${session.user.id}`);

		// Tags de tri (pour s'assurer que les listes triées sont actualisées)
		revalidateTag(`organizations:${session.user.id}:sort:name:asc`);
		revalidateTag(`organizations:${session.user.id}:sort:name:desc`);
		revalidateTag(`organizations:${session.user.id}:sort:createdAt:asc`);
		revalidateTag(`organizations:${session.user.id}:sort:createdAt:desc`);

		// Tags de recherche si le nom a été modifié
		if (updateData.name !== organization.name) {
			// Revalider les recherches potentielles qui pourraient maintenant inclure ou exclure cette organisation
			revalidateTag(`organizations:${session.user.id}:search:`);
		}

		revalidateTag(`organization:${organization.id}:${session.user.id}`);
		// 8. Retour de la réponse de succès
		return createSuccessResponse(
			organization,
			`L'organisation ${organization.name} a été mise à jour avec succès`
		);
	} catch (error) {
		console.error("[UPDATE_ORGANIZATION]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de mettre à jour l'organisation"
		);
	}
}
