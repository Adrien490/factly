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
import { Product, ProductStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { archiveMultipleProductsSchema } from "../schemas/archive-multiple-products-schema";

export const archiveMultipleProducts: ServerAction<
	Product[],
	typeof archiveMultipleProductsSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour archiver des produits"
			);
		}

		// 2. Récupération des données
		const rawData = {
			ids: formData.getAll("ids") as string[],
		};

		// 3. Validation des données
		const validation = archiveMultipleProductsSchema.safeParse(rawData);
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre sélection."
			);
		}

		// 4. Vérification de l'existence des produits
		const existingProducts = await db.product.findMany({
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

		if (existingProducts.length !== validation.data.ids.length) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Un ou plusieurs produits n'ont pas été trouvés"
			);
		}

		// 5. Filtrer les produits qui ne sont pas déjà archivés
		const productsToArchive = existingProducts.filter(
			(product) => product.status !== ProductStatus.ARCHIVED
		);

		if (productsToArchive.length === 0) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Aucun des produits sélectionnés ne peut être archivé"
			);
		}

		// 6. Archivage des produits
		await db.product.updateMany({
			where: {
				id: {
					in: productsToArchive.map((product) => product.id),
				},
			},
			data: {
				status: ProductStatus.ARCHIVED,
			},
		});

		// 7. Récupération des produits mis à jour
		const updatedProducts = await db.product.findMany({
			where: {
				id: {
					in: productsToArchive.map((product) => product.id),
				},
			},
		});

		// 8. Invalidation du cache
		revalidateTag(`products`);
		for (const id of validation.data.ids) {
			revalidateTag(`products:${id}`);
		}

		return createSuccessResponse(
			updatedProducts,
			`${productsToArchive.length} produit(s) archivé(s) avec succès`
		);
	} catch (error) {
		console.error("[ARCHIVE_MULTIPLE_PRODUCTS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de l'archivage des produits"
		);
	}
};
