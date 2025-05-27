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
import { archiveMultipleSuppliersSchema } from "../schemas/archive-multiple-suppliers-schema";

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
		const ids = formData.getAll("ids") as string[];

		// 3. Validation des données
		const validation = archiveMultipleSuppliersSchema.safeParse({
			ids,
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

		// 5. Filtrer les fournisseurs qui ne sont pas déjà archivés
		const suppliersToArchive = existingSuppliers.filter(
			(supplier) => supplier.status !== SupplierStatus.ARCHIVED
		);

		if (suppliersToArchive.length === 0) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Tous les fournisseurs sélectionnés sont déjà archivés"
			);
		}

		// 6. Mise à jour des fournisseurs
		await db.supplier.updateMany({
			where: {
				id: {
					in: suppliersToArchive.map((supplier) => supplier.id),
				},
			},
			data: {
				status: SupplierStatus.ARCHIVED,
			},
		});

		// Récupération des fournisseurs mis à jour
		const updatedSuppliers = await db.supplier.findMany({
			where: {
				id: {
					in: suppliersToArchive.map((supplier) => supplier.id),
				},
			},
		});

		// 7. Invalidation du cache
		for (const id of validation.data.ids) {
			revalidateTag(`suppliers:${id}`);
		}
		revalidateTag(`suppliers`);

		const message = `${suppliersToArchive.length} fournisseur(s) ont été archivé(s) avec succès`;

		return createSuccessResponse(updatedSuppliers, message, {
			archivedSupplierIds: suppliersToArchive.map((supplier) => supplier.id),
		});
	} catch (error) {
		console.error("[ARCHIVE_MULTIPLE_SUPPLIERS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de l'archivage des fournisseurs"
		);
	}
};
