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
import { archiveSupplierSchema } from "../schemas";

export const archiveSupplier: ServerAction<
	Supplier,
	typeof archiveSupplierSchema
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
		const id = formData.get("id") as string;
		const organizationId = formData.get("organizationId") as string;

		// 3. Validation des données
		const validation = archiveSupplierSchema.safeParse({
			id,
			organizationId,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				{ id, organizationId },
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

		// 5. Vérification de l'existence du fournisseur
		const existingSupplier = await db.supplier.findUnique({
			where: {
				id,
				organizationId,
			},
			select: {
				id: true,
				status: true,
			},
		});

		if (!existingSupplier) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Le fournisseur n'a pas été trouvé"
			);
		}

		// 6. Vérification que le fournisseur n'est pas déjà archivé
		if (existingSupplier.status === SupplierStatus.ARCHIVED) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Ce fournisseur est déjà archivé"
			);
		}

		// 7. Mise à jour du fournisseur
		const updatedSupplier = await db.supplier.update({
			where: {
				id,
				organizationId,
			},
			data: {
				status: SupplierStatus.ARCHIVED,
			},
		});

		// 8. Invalidation du cache
		revalidateTag(`organizations:${organizationId}:suppliers:${id}`);
		revalidateTag(`organizations:${organizationId}:suppliers`);

		return createSuccessResponse(
			updatedSupplier,
			"Le fournisseur a été archivé avec succès"
		);
	} catch (error) {
		console.error("[ARCHIVE_SUPPLIER]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de l'archivage du fournisseur"
		);
	}
};
