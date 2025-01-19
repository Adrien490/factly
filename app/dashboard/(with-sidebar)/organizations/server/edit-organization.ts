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
import { Country, LegalForm, Organization } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import OrganizationFormSchema from "../schemas/organization-form-schema";

export default async function editOrganization(
	_: ServerActionState<Organization, typeof OrganizationFormSchema> | null,
	formData: FormData
): Promise<ServerActionState<Organization, typeof OrganizationFormSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) {
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
				members: {
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
			capital: (() => {
				const value = formData.get("capital");
				if (!value || value === "") return null;
				const num = Number(value);
				return isNaN(num) ? null : num;
			})(),
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
				id: existingOrganization.id,
			},
			data: {
				name: validation.data.name,
				siren: validation.data.siren,
				siret: validation.data.siret,
				vatNumber: validation.data.vatNumber,
				vatOptionDebits: validation.data.vatOptionDebits,
				legalForm: validation.data.legalForm as LegalForm,
				rcsNumber: validation.data.rcsNumber,
				capital: validation.data.capital,
				address: validation.data.address,
				city: validation.data.city,
				zipCode: validation.data.zipCode,
				country: validation.data.country as Country,
				phone: validation.data.phone,
				email: validation.data.email,
				website: validation.data.website,
				updatedAt: new Date(),
			},
		});

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
