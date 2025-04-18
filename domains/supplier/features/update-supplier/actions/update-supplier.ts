"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import db from "@/shared/lib/db";

import {
	ActionState,
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types";
import { Supplier, SupplierStatus, SupplierType } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { updateSupplierSchema } from "../schemas";

/**
 * Action serveur pour mettre à jour un fournisseur existant
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 */
export async function updateSupplier(
	_: ActionState<Supplier, typeof updateSupplierSchema> | null,
	formData: FormData
): Promise<ActionState<Supplier, typeof updateSupplierSchema>> {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier un fournisseur"
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
			id: formData.get("id") as string,
			organizationId: organizationId.toString(),
			name: formData.get("name") as string,
			legalName: formData.get("legalName") as string,
			email: formData.get("email") as string,
			phone: formData.get("phone") as string,
			website: formData.get("website") as string,
			siren: formData.get("siren") as string,
			siret: formData.get("siret") as string,
			supplierType: formData.get("supplierType") as SupplierType,
			status: formData.get("status") as SupplierStatus,
			notes: formData.get("notes") as string,
			userId: session.user.id,
			vatNumber: formData.get("vatNumber") as string,
		};

		console.log("[UPDATE_SUPPLIER] Raw data:", rawData);

		// 5. Validation des données avec le schéma Zod
		const validation = updateSupplierSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[UPDATE_SUPPLIER] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez remplir tous les champs obligatoires"
			);
		}

		// 6. Vérification de l'existence du fournisseur
		const existingSupplier = await db.supplier.findUnique({
			where: {
				id: validation.data.id,
			},
			select: { id: true },
		});

		if (!existingSupplier) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Le fournisseur à mettre à jour n'existe pas",
				rawData
			);
		}

		// 7. Mise à jour du fournisseur dans la base de données
		const { ...supplierData } = validation.data;

		// Mettre à jour le fournisseur
		const supplier = await db.supplier.update({
			where: { id: supplierData.id },
			data: supplierData,
		});

		// 8. Invalidation du cache pour forcer un rafraîchissement des données
		revalidateTag(
			`organization:${supplierData.organizationId}:supplier:${supplierData.id}`
		);
		revalidateTag(`organizations:${supplierData.organizationId}:suppliers`);

		// 9. Retour de la réponse de succès
		return createSuccessResponse(
			supplier,
			`Le fournisseur ${supplier.name} a été modifié avec succès`,
			rawData
		);
	} catch (error) {
		console.error("[UPDATE_SUPPLIER]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de modifier le fournisseur"
		);
	}
}
