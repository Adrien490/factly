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
import { generateUniqueSlug } from "@/shared/utils";
import {
	AddressType,
	BusinessSector,
	Country,
	EmployeeCount,
	FiscalYearStatus,
	LegalForm,
} from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { createOrganizationSchema } from "../schemas";
import { CreateOrganizationReturn } from "../types";

export const createOrganization: ServerAction<
	CreateOrganizationReturn,
	typeof createOrganizationSchema
> = async (_, formData) => {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer une organisation"
			);
		}

		const rawData = {
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

		// 3. Validation des données avec le schéma Zod
		const validation = createOrganizationSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[CREATE_ORGANIZATION] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Veuillez remplir tous les champs obligatoires"
			);
		}

		// 4. Vérification des doublons (SIRET, TVA)
		if (validation.data.siret) {
			const existingOrgBySiret = await db.company.findFirst({
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

		if (validation.data.vatNumber) {
			const existingOrgByVatNumber = await db.company.findFirst({
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

		const uniqueSlug = generateUniqueSlug(validation.data.companyName);

		// 6. Création de l'organisation dans la base de donnée
		const organization = await db.organization.create({
			data: {
				slug: uniqueSlug,
				user: { connect: { id: session.user.id } },
				members: {
					create: {
						user: { connect: { id: session.user.id } },
					},
				},
				company: {
					create: {
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
					create: {
						addressType: AddressType.HEADQUARTERS,
						addressLine1: validation.data.addressLine1 || "",
						addressLine2: validation.data.addressLine2 || "",
						postalCode: validation.data.postalCode || "",
						city: validation.data.city || "",
						country: validation.data.country,
						isDefault: true,
					},
				},
			},
			include: {
				company: true,
			},
		});

		// 7. Création automatique d'une année fiscale initiale
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();

		await db.fiscalYear.create({
			data: {
				organizationId: organization.id,
				name: `Année fiscale ${currentYear}`,
				description: `Année fiscale initiale pour ${organization.company?.name || "l'organisation"}`,
				startDate: new Date(currentYear, 0, 1),
				endDate: new Date(currentYear, 11, 31),
				status: FiscalYearStatus.ACTIVE,
				isCurrent: true,
			},
		});

		// Revalidation des tags de cache
		revalidateTag("organizations");

		return createSuccessResponse(
			organization,
			`L'organisation a été créée avec succès`
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
};
