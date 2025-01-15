"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/types/server-action";
import { Organization } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import OrganizationFormSchema from "../schemas/organization-form-schema";

export default async function editOrganization(
	_: ServerActionState<Organization, typeof OrganizationFormSchema> | null,
	formData: FormData
) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier une organisation"
			);
		}

		// Récupération de l'ID de l'organisation
		const organizationId = formData.get("id");
		if (!organizationId) {
			return createErrorResponse(
				ServerActionStatus.ERROR,
				"L'ID de l'organisation est requis"
			);
		}

		// Vérification que l'utilisateur a les droits sur l'organisation
		const existingOrganization = await db.organization.findFirst({
			where: {
				id: organizationId as string,
				memberships: {
					some: {
						userId: session.user.id,
						role: {
							in: ["OWNER", "ADMIN"],
						},
					},
				},
			},
		});

		if (!existingOrganization) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous n'avez pas les droits pour modifier cette organisation"
			);
		}

		const rawData = {
			name: formData.get("name"),
			siren: formData.get("siren"),
			siret: formData.get("siret"),
			vatNumber: formData.get("vatNumber"),
			vatOptionDebits: formData.get("vatOptionDebits") === "true",
			legalForm: formData.get("legalForm"),
			rcsNumber: formData.get("rcsNumber"),
			capital: formData.get("capital") ? Number(formData.get("capital")) : null,
			address: formData.get("address"),
			city: formData.get("city"),
			zipCode: formData.get("zipCode"),
			country: formData.get("country"),
			phone: formData.get("phone"),
			email: formData.get("email"),
			website: formData.get("website"),
		};

		const validation = OrganizationFormSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs ci-dessous"
			);
		}

		const organization = await db.organization.update({
			where: {
				id: organizationId as string,
			},
			data: {
				...validation.data,
				updatedAt: new Date(),
			},
		});

		// Invalider le cache
		revalidateTag("organizations");
		revalidateTag(`user-${session.user.id}-organizations`);

		return createSuccessResponse(
			organization,
			`L'organisation ${organization.name} a été modifiée avec succès`
		);
	} catch (error) {
		console.error("[EDIT_ORGANIZATION]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de modifier l'organisation"
		);
	}
}
