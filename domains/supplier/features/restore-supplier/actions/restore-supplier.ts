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
import { restoreSupplierSchema } from "../schemas";

export const restoreSupplier: ServerAction<
	Supplier,
	typeof restoreSupplierSchema
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
		const status = formData.get("status") as SupplierStatus;

		// 3. Validation des données
		const validation = restoreSupplierSchema.safeParse({
			id,
			status,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre sélection."
			);
		}

		// 4. Vérification de l'existence du fournisseur
		const existingSupplier = await db.supplier.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				status: true,
				reference: true,
			},
		});

		if (!existingSupplier) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Le fournisseur n'a pas été trouvé"
			);
		}

		// 5. Vérification que le fournisseur est bien archivé
		if (existingSupplier.status !== SupplierStatus.ARCHIVED) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Ce fournisseur n'est pas archivé"
			);
		}

		// 6. Mise à jour du fournisseur
		const updatedSupplier = await db.supplier.update({
			where: {
				id,
			},
			data: {
				status: validation.data.status,
			},
		});

		// 7. Invalidation du cache
		revalidateTag(`suppliers:${id}`);
		revalidateTag(`suppliers`);

		// 8. Message de succès personnalisé
		const statusText =
			validation.data.status === SupplierStatus.ACTIVE
				? "actif"
				: validation.data.status === SupplierStatus.INACTIVE
					? "inactif"
					: "autre statut";

		const message = `Le fournisseur ${existingSupplier.reference} a été restauré en ${statusText} avec succès`;

		return createSuccessResponse(updatedSupplier, message);
	} catch (error) {
		console.error("[RESTORE_SUPPLIER]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la restauration du fournisseur"
		);
	}
};
