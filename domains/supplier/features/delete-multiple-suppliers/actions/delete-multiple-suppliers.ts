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
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { deleteMultipleSuppliersSchema } from "../schemas";

export const deleteMultipleSuppliers: ServerAction<
	null,
	typeof deleteMultipleSuppliersSchema
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
		const supplierIds = formData.getAll("ids") as string[];

		console.log("[DELETE_SUPPLIERS] Form Data:", {
			ids: supplierIds,
		});

		// 3. Validation complète des données
		const validation = deleteMultipleSuppliersSchema.safeParse({
			ids: supplierIds,
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
				id: { in: validation.data.ids },
			},
			select: {
				id: true,
			},
		});

		if (existingSuppliers.length !== validation.data.ids.length) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Certains fournisseurs sont introuvables"
			);
		}

		// 5. Suppression
		await db.supplier.deleteMany({
			where: {
				id: { in: validation.data.ids },
			},
		});

		// Revalidation du cache
		revalidateTag(`suppliers`);
		validation.data.ids.forEach((supplierId) => {
			revalidateTag(`suppliers:${supplierId}`);
		});
		revalidateTag(`suppliers:count`);

		return createSuccessResponse(
			null,
			`${validation.data.ids.length} fournisseur(s) supprimé(s) définitivement`
		);
	} catch (error) {
		console.error("[DELETE_MULTIPLE_SUPPLIERS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Impossible de supprimer les fournisseurs sélectionnés"
		);
	}
};
