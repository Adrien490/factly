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

		// 2. Récupération des données
		const rawData = {
			id: formData.get("id") as string,
			status: formData.get("status") as SupplierStatus,
		};

		// 3. Validation complète des données
		const validation = updateSupplierStatusSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre saisie.",
				rawData
			);
		}

		// 4. Vérification de l'existence du fournisseur
		const existingSupplier = await db.supplier.findFirst({
			where: {
				id: validation.data.id,
			},
			select: {
				id: true,
				status: true,
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

		// 5. Mise à jour du statut
		const updatedSupplier = await db.supplier.update({
			where: { id: validation.data.id },
			data: {
				status: validation.data.status,
			},
		});

		// 6. Revalidation du cache
		revalidateTag(`suppliers`);
		revalidateTag(`suppliers:${existingSupplier.id}`);

		const message = `Le statut du fournisseur a été mis à jour avec succès`;

		return createSuccessResponse(updatedSupplier, message);
	} catch (error) {
		console.error("[UPDATE_SUPPLIER_STATUS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Impossible de mettre à jour le statut du fournisseur"
		);
	}
};
