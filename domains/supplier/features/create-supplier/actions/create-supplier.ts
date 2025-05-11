"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import db from "@/shared/lib/db";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import {
	AddressType,
	Country,
	Supplier,
	SupplierStatus,
	SupplierType,
} from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { createSupplierSchema } from "../schemas";

/**
 * Action serveur pour créer un nouveau fournisseur
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 */
export const createSupplier: ServerAction<
	Supplier,
	typeof createSupplierSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer un fournisseur"
			);
		}

		// 2. Vérification de base des données requises
		const organizationId = formData.get("organizationId");
		if (!organizationId) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation est requis"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId.toString());
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Préparation et transformation des données brutes
		const rawData = {
			organizationId: organizationId.toString(),
			name: formData.get("name") as string,
			legalName: formData.get("legalName") as string,
			email: formData.get("email") as string,
			phone: formData.get("phone") as string,
			website: formData.get("website") as string,
			siren: formData.get("siren") as string,
			siret: formData.get("siret") as string,
			vatNumber: formData.get("vatNumber") as string,
			supplierType: formData.get("supplierType") as SupplierType,
			status: formData.get("status") as SupplierStatus,
			notes: formData.get("notes") as string,

			// Informations d'adresse
			addressType: formData.get("addressType") as AddressType,
			addressLine1: formData.get("addressLine1") as string,
			addressLine2: formData.get("addressLine2") as string,
			postalCode: formData.get("postalCode") as string,
			city: formData.get("city") as string,
			country: (formData.get("country") as string) || "France",

			// Coordonnées géographiques
			latitude: formData.get("latitude")
				? parseFloat(formData.get("latitude") as string)
				: null,
			longitude: formData.get("longitude")
				? parseFloat(formData.get("longitude") as string)
				: null,
		};

		// 5. Validation des données avec le schéma Zod
		const validation = createSupplierSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[CREATE_SUPPLIER] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Veuillez remplir tous les champs obligatoires"
			);
		}

		// 6. Création du fournisseur dans la base de données
		const {
			organizationId: validatedOrgId,

			// Extraire les champs d'adresse pour les gérer séparément
			addressType,
			addressLine1,
			addressLine2,
			postalCode,
			city,
			country,
			latitude,
			longitude,
			...supplierData
		} = validation.data;

		// Créer le fournisseur avec les relations appropriées
		const supplier = await db.supplier.create({
			data: {
				...supplierData,
				organization: { connect: { id: validatedOrgId } },

				// Créer l'adresse si des informations sont fournies
				...(addressLine1 &&
					addressLine1.trim() !== "" && {
						addresses: {
							create: [
								{
									addressType,
									addressLine1,
									addressLine2,
									postalCode: postalCode || "",
									city: city || "",
									country: country as Country,
									isDefault: true,
									...(latitude !== null &&
										longitude !== null && {
											latitude,
											longitude,
										}),
								},
							],
						},
					}),
			},
		});

		// 7. Invalidation du cache pour forcer un rafraîchissement des données
		revalidateTag(`organizations:${validatedOrgId}:suppliers`);
		revalidateTag(`organizations:${validatedOrgId}:suppliers:count`);
		// 8. Retour de la réponse de succès
		return createSuccessResponse(
			supplier,
			`Le fournisseur ${supplier.name} a été créé avec succès`
		);
	} catch (error) {
		console.error("[CREATE_SUPPLIER]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de créer le fournisseur"
		);
	}
};
