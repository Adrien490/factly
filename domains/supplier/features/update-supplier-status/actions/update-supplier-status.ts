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
import { updateSupplierStatusSchema } from "../schemas";

export const updateSupplierStatus: ServerAction<
	Supplier,
	typeof updateSupplierStatusSchema
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

		// 2. Vérification de base des données requises
		const rawData = {
			id: formData.get("id") as string,
			organizationId: formData.get("organizationId") as string,
			status: formData.get("status") as SupplierStatus,
		};

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(rawData.organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Validation complète des données
		const validation = updateSupplierStatusSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Validation échouée. Veuillez vérifier votre saisie."
			);
		}

		// 5. Vérification de l'existence du fournisseur
		const existingSupplier = await db.supplier.findFirst({
			where: {
				id: validation.data.id,
				organizationId: validation.data.organizationId,
			},
			select: {
				id: true,
				status: true,
				name: true,
			},
		});

		if (!existingSupplier) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Fournisseur introuvable"
			);
		}

		// Vérification si le statut est le même
		if (existingSupplier.status === validation.data.status) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Le fournisseur a déjà ce statut"
			);
		}

		// 6. Mise à jour du statut
		const updatedSupplier = await db.supplier.update({
			where: { id: validation.data.id },
			data: {
				status: validation.data.status,
			},
		});

		// 7. Revalidation du cache
		revalidateTag(`organizations:${rawData.organizationId}:suppliers`);
		revalidateTag(
			`organizations:${rawData.organizationId}:suppliers:${existingSupplier.id}`
		);

		return createSuccessResponse(
			updatedSupplier,
			`Statut du fournisseur "${existingSupplier.name}" mis à jour`
		);
	} catch (error) {
		console.error("[UPDATE_SUPPLIER_STATUS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Impossible de mettre à jour le statut du fournisseur"
		);
	}
};
