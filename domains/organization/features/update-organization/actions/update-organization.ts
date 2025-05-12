"use server";

import { auth } from "@/domains/auth";
import db from "@/shared/lib/db";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import {
	BusinessSector,
	Country,
	EmployeeCount,
	LegalForm,
	Organization,
} from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { updateOrganizationSchema } from "../schemas";

export const updateOrganization: ServerAction<
	Organization,
	typeof updateOrganizationSchema
> = async (_, formData) => {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour mettre à jour une organisation"
			);
		}

		const rawData = {
			id: formData.get("id") as string,
			companyName: formData.get("companyName") as string,
			legalForm: formData.get("legalForm") as LegalForm,
			email: formData.get("email") as string,
			phoneNumber: formData.get("phoneNumber") as string,
			website: formData.get("website") as string,
			siren: formData.get("siren") as string,
			siret: formData.get("siret") as string,
			vatNumber: formData.get("vatNumber") as string,
			addressLine1: formData.get("addressLine1") as string,
			addressLine2: formData.get("addressLine2") as string,
			postalCode: formData.get("postalCode") as string,
			city: formData.get("city") as string,
			country: formData.get("country") as Country,
			logoUrl: formData.get("logoUrl") as string,
			nafApeCode: formData.get("nafApeCode") as string,
			capital: formData.get("capital") as string,
			rcs: formData.get("rcs") as string,
			businessSector: formData.get("businessSector") as string,
			employeeCount: formData.get("employeeCount") as string,
			mobileNumber: formData.get("mobileNumber") as string,
			faxNumber: formData.get("faxNumber") as string,
		};

		console.log("[UPDATE_ORGANIZATION] Raw data:", rawData);

		// Validation des données avec le schéma Zod
		const validation = updateOrganizationSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[UPDATE_ORGANIZATION] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Veuillez remplir tous les champs obligatoires"
			);
		}

		// Vérification que l'organisation existe et que l'utilisateur a les droits
		const existingOrg = await db.organization.findFirst({
			where: {
				id: validation.data.id,
				members: {
					some: {
						userId: session.user.id,
					},
				},
			},
		});

		if (!existingOrg) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Organisation non trouvée ou vous n'avez pas les droits pour la modifier"
			);
		}

		// Mise à jour de l'organisation
		const organization = await db.organization.update({
			where: {
				id: validation.data.id,
			},
			data: {
				company: {
					update: {
						name: validation.data.companyName,
						legalForm: validation.data.legalForm as LegalForm,
						siren: validation.data.siren || null,
						siret: validation.data.siret || null,
						nafApeCode: validation.data.nafApeCode || null,
						capital: validation.data.capital || null,
						rcs: validation.data.rcs || null,
						vatNumber: validation.data.vatNumber || null,
						businessSector:
							(validation.data.businessSector as BusinessSector) || null,
						employeeCount:
							(validation.data.employeeCount as EmployeeCount) || null,
						phoneNumber: validation.data.phoneNumber || null,
						mobileNumber: validation.data.mobileNumber || null,
						faxNumber: validation.data.faxNumber || null,
						website: validation.data.website || null,
						logoUrl: validation.data.logoUrl || null,
						email: validation.data.email || null,
					},
				},
				address: {
					update: {
						addressLine1: validation.data.addressLine1 || "",
						addressLine2: validation.data.addressLine2 || "",
						postalCode: validation.data.postalCode || "",
						city: validation.data.city || "",
						country: validation.data.country,
					},
				},
			},
		});

		// Revalidation des tags de cache
		revalidateTag("organizations");
		revalidateTag(`organization-${organization.id}`);

		return createSuccessResponse(
			organization,
			`L'organisation a été mise à jour avec succès`
		);
	} catch (error) {
		console.error("[UPDATE_ORGANIZATION]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de mettre à jour l'organisation"
		);
	}
};
