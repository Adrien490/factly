"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";

import {
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/types/server-action";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import OrganizationFormSchema from "../schemas/organization-form-schema";

export default async function createOrganization(
	_: unknown,
	formData: FormData
) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer une organisation"
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

		console.log(validation.data);

		const organization = await db.organization.create({
			data: {
				...validation.data,
				memberships: {
					create: {
						userId: session.user.id,
						role: "OWNER",
						status: "ACTIVE",
					},
				},
			},
		});

		// Invalider le cache
		revalidateTag("organizations");
		revalidateTag(`user-${session.user.id}-organizations`);

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
