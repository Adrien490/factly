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
} from "@/shared/types";
import { Supplier, SupplierStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { archiveMultipleSuppliersSchema } from "../schemas";

export const archiveMultipleSuppliers: ServerAction<
	Supplier[],
	typeof archiveMultipleSuppliersSchema
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

		// 3. Validation des données
		const validation = archiveMultipleSuppliersSchema.safeParse({
			ids,
			organizationId,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				{ ids, organizationId },
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

		// 6. Vérification si les fournisseurs sont déjà archivés
		const alreadyArchived = existingSuppliers.some(
			(supplier) => supplier.status === SupplierStatus.ARCHIVED
		);
		if (alreadyArchived) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Un ou plusieurs fournisseurs sont déjà archivés"
			);
		}

		// 7. Mise à jour des fournisseurs
		await db.supplier.updateMany({
			where: {
				id: {
					in: validation.data.ids,
				},
				organizationId: validation.data.organizationId,
			},
			data: {
				status: SupplierStatus.ARCHIVED,
			},
		});

		// Récupération des fournisseurs mis à jour
		const updatedSuppliers = await db.supplier.findMany({
			where: {
				id: {
					in: validation.data.ids,
				},
				organizationId: validation.data.organizationId,
			},
		});

		// 8. Invalidation du cache
		for (const id of validation.data.ids) {
			revalidateTag(`organizations:${organizationId}:suppliers:${id}`);
		}
		revalidateTag(`organizations:${organizationId}:suppliers`);

		return createSuccessResponse(
			updatedSuppliers,
			"Les fournisseurs ont été archivés avec succès"
		);
	} catch (error) {
		console.error("[ARCHIVE_MULTIPLE_SUPPLIERS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de l'archivage des fournisseurs"
		);
	}
};
