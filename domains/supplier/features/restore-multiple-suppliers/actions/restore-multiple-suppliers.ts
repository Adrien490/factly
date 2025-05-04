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
import { Supplier, SupplierStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { restoreMultipleSuppliersSchema } from "../schemas/restore-multiple-suppliers-schema";

export const restoreMultipleSuppliers: ServerAction<
	Supplier[],
	typeof restoreMultipleSuppliersSchema
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
		const ids = formData.getAll("ids") as string[];
		const status = formData.get("status") as SupplierStatus;

		// 3. Validation des données
		const validation = restoreMultipleSuppliersSchema.safeParse({
			ids,
			organizationId,
			status,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				{ ids, organizationId, status },
				"Validation échouée. Veuillez vérifier votre sélection."
			);
		}

		// 4. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 5. Vérification de l'existence des fournisseurs
		const existingSuppliers = await db.supplier.findMany({
			where: {
				id: {
					in: validation.data.ids,
				},
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
				"Un ou plusieurs fournisseurs n'ont pas été trouvés"
			);
		}

		// 6. Filtrer les fournisseurs qui sont actuellement archivés
		const suppliersToRestore = existingSuppliers.filter(
			(supplier) => supplier.status === SupplierStatus.ARCHIVED
		);

		if (suppliersToRestore.length === 0) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Aucun des fournisseurs sélectionnés n'est archivé"
			);
		}

		// 7. Mise à jour des fournisseurs avec le statut spécifié
		await db.supplier.updateMany({
			where: {
				id: {
					in: suppliersToRestore.map((supplier) => supplier.id),
				},
				organizationId: validation.data.organizationId,
			},
			data: {
				status: validation.data.status,
			},
		});

		// Récupération des fournisseurs mis à jour
		const updatedSuppliers = await db.supplier.findMany({
			where: {
				id: {
					in: suppliersToRestore.map((supplier) => supplier.id),
				},
				organizationId: validation.data.organizationId,
			},
		});

		// 8. Invalidation du cache
		for (const id of validation.data.ids) {
			revalidateTag(`organizations:${organizationId}:suppliers:${id}`);
		}
		revalidateTag(`organizations:${organizationId}:suppliers`);

		// 9. Message de succès personnalisé
		const statusText =
			validation.data.status === SupplierStatus.ACTIVE
				? "actif"
				: validation.data.status === SupplierStatus.INACTIVE
				? "inactif"
				: "autre statut";

		const message = `${suppliersToRestore.length} fournisseur(s) ont été restauré(s) en ${statusText} avec succès`;

		return createSuccessResponse(updatedSuppliers, message, {
			restoredSupplierIds: suppliersToRestore.map((supplier) => supplier.id),
		});
	} catch (error) {
		console.error("[RESTORE_MULTIPLE_SUPPLIERS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la restauration des fournisseurs"
		);
	}
};
