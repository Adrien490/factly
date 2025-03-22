// features/organizations/actions/create-organization.ts
"use server";

import { auth } from "@/features/auth/lib/auth";
import calculateFiscalYearDates from "@/features/fiscal-years/lib/calculate-fiscal-years-date";
import getTaxRates from "@/features/tax-rates/lib/get-tax-rates";
import db from "@/shared/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types/server-action";
import { FiscalYearStatus, LegalForm, Organization } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import organizationFormSchema from "../schemas/create-organization-schema";

export default async function createOrganization(
	_: ServerActionState<Organization, typeof organizationFormSchema> | null,
	formData: FormData
): Promise<ServerActionState<Organization, typeof organizationFormSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer une organisation"
			);
		}

		const rawData = {
			// Section 1: Informations de base (obligatoires)
			name: formData.get("name")?.toString() || "",
			legalName: formData.get("legalName")?.toString() || "",
			legalForm: (formData.get("legalForm")?.toString() as LegalForm) || null,
			logoUrl: formData.get("logoUrl")?.toString() || null,

			// Section 2: Identifiants fiscaux (hautement recommandés)
			siren: formData.get("siren")?.toString() || null,
			siret: formData.get("siret")?.toString() || null,
			vatNumber: formData.get("vatNumber")?.toString() || null,

			// Section 3: Adresse (recommandée)
			addressLine1: formData.get("addressLine1")?.toString() || null,
			addressLine2: formData.get("addressLine2")?.toString() || null,
			postalCode: formData.get("postalCode")?.toString() || null,
			city: formData.get("city")?.toString() || null,
			country: formData.get("country")?.toString() || "France",

			// Section 4: Informations complémentaires (optionnelles)
			email: formData.get("email")?.toString() || "",
			phone: formData.get("phone")?.toString() || null,
			website: formData.get("website")?.toString() || null,
		};

		console.log("Raw data:", rawData);

		const validation = organizationFormSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs ci-dessous"
			);
		}

		// Calcul des dates pour l'année fiscale
		const fiscalYear = calculateFiscalYearDates();

		// Récupération des taux de TVA standards
		const standardTaxRates = getTaxRates();

		// Création de l'organisation avec les champs du nouveau schéma
		const organization = await db.organization.create({
			data: {
				// Section 1: Informations de base
				name: validation.data.name,
				legalName: validation.data.legalName,
				legalForm: validation.data.legalForm,
				email: validation.data.email,

				// Section 2: Identifiants fiscaux
				siren: validation.data.siren,
				siret: validation.data.siret,
				vatNumber: validation.data.vatNumber,

				// Section 3: Adresse
				addressLine1: validation.data.addressLine1,
				addressLine2: validation.data.addressLine2,
				postalCode: validation.data.postalCode,
				city: validation.data.city,
				country: validation.data.country,

				// Section 4: Informations complémentaires
				phone: validation.data.phone,
				website: validation.data.website,
				logoUrl: validation.data.logoUrl,

				// Relations
				members: {
					create: {
						userId: session.user.id,
					},
				},

				// Création automatique de l'année fiscale
				fiscalYears: {
					create: {
						name: fiscalYear.name,
						description: `Année fiscale générée automatiquement à la création de l'organisation`,
						startDate: fiscalYear.startDate,
						endDate: fiscalYear.endDate,
						status: FiscalYearStatus.ACTIVE,
						isCurrent: true,
					},
				},

				// Création automatique des taux de TVA standards français
				taxRates: {
					create: standardTaxRates,
				},

				// Paramétrage basique pour la facturation électronique (obligatoire d'ici 2026)
			},
		});

		// Invalidation du cache des organisations pour cet utilisateur
		revalidateTag(`organizations:user:${session.user.id}`);

		return createSuccessResponse(
			organization,
			`L'organisation ${organization.name} a été créée avec succès avec son année fiscale et ses taux de TVA`
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
