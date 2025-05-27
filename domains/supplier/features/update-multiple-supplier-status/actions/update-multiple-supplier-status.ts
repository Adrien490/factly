"use server";

import { auth } from "@/domains/auth";
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
import { updateMultipleSupplierStatusSchema } from "../schemas/update-multiple-supplier-status-schema";

export const updateMultipleSupplierStatus: ServerAction<
	Supplier[],
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
		const ids = formData.getAll("ids") as string[];
		const status = formData.get("status") as SupplierStatus;

		// 3. Validation des données
		const validation = updateMultipleSupplierStatusSchema.safeParse({
			ids,
			status,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre sélection."
			);
		}

		// 4. Vérification de l'existence des fournisseurs
		const existingSuppliers = await db.supplier.findMany({
			where: {
				id: {
					in: validation.data.ids,
				},
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

		// 5. Mise à jour des fournisseurs
		await db.supplier.updateMany({
			where: {
				id: {
					in: validation.data.ids,
				},
			},
			data: {
				status: validation.data.status,
			},
		});

		// Récupération des fournisseurs mis à jour
		const updatedSuppliers = await db.supplier.findMany({
			where: {
				id: {
					in: validation.data.ids,
				},
			},
		});

		// 6. Invalidation du cache
		for (const id of validation.data.ids) {
			revalidateTag(`suppliers:${id}`);
		}
		revalidateTag(`suppliers`);

		// 7. Message de succès personnalisé
		const message = `${existingSuppliers.length} fournisseur(s) ont été mis à jour avec succès`;

		return createSuccessResponse(updatedSuppliers, message);
	} catch (error) {
		console.error("[UPDATE_MULTIPLE_SUPPLIER_STATUS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la mise à jour du statut"
		);
	}
};
