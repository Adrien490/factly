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
import { SupplierStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { updateMultipleSupplierStatusSchema } from "../schemas/update-multiple-supplier-status-schema";

export const updateMultipleSupplierStatus: ServerAction<
	null,
	typeof updateMultipleSupplierStatusSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour effectuer cette action"
			);
		}

		// 2. Récupération des données
		const organizationId = formData.get("organizationId") as string;
		const supplierIds = formData.getAll("ids") as string[];
		const status = formData.get("status") as SupplierStatus;

		// Vérification que l'organizationId n'est pas vide
		if (!organizationId) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"L'ID de l'organisation est manquant"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Validation complète des données
		const validation = updateMultipleSupplierStatusSchema.safeParse({
			ids: supplierIds,
			organizationId,
			status,
		});

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre sélection."
			);
		}

		// 5. Vérification de l'existence des fournisseurs
		const existingSuppliers = await db.supplier.findMany({
			where: {
				id: { in: validation.data.ids },
				organizationId: validation.data.organizationId,
			},
			select: {
				id: true,
				status: true,
			},
		});

		if (existingSuppliers.length !== validation.data.ids.length) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Certains fournisseurs sont introuvables"
			);
		}

		// Filtrer les fournisseurs qui n'ont pas déjà le statut cible
		const suppliersToUpdate = existingSuppliers.filter(
			(supplier) => supplier.status !== validation.data.status
		);

		if (suppliersToUpdate.length === 0) {
			return createSuccessResponse(
				null,
				"Tous les fournisseurs sélectionnés ont déjà ce statut"
			);
		}

		// 6. Mise à jour
		await db.supplier.updateMany({
			where: {
				id: { in: suppliersToUpdate.map((supplier) => supplier.id) },
				organizationId: validation.data.organizationId,
			},
			data: {
				status: validation.data.status,
			},
		});

		// 7. Revalidation du cache
		revalidateTag(`organizations:${organizationId}:suppliers`);
		revalidateTag(`organizations:${organizationId}:suppliers:count`);

		const message = `${suppliersToUpdate.length} fournisseur(s) ont été mis à jour avec succès`;

		return createSuccessResponse(null, message);
	} catch (error) {
		console.error("[UPDATE_MULTIPLE_SUPPLIER_STATUS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Impossible de mettre à jour le statut des fournisseurs"
		);
	}
};
