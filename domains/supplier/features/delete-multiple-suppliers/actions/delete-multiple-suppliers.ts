"use server";

import { auth } from "@/domains/auth";
import db from "@/shared/lib/db";

import { hasOrganizationAccess } from "@/domains/organization/features";
import {
	ActionState,
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types/server-action";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { deleteMultipleSuppliersSchema } from "../schemas";

export async function deleteMultipleSuppliers(
	_: ActionState<null, typeof deleteMultipleSuppliersSchema> | null,
	formData: FormData
): Promise<ActionState<null, typeof deleteMultipleSuppliersSchema>> {
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
		const supplierIds = formData.getAll("ids") as string[];

		console.log("[DELETE_MULTIPLE_SUPPLIERS] Form Data:", {
			ids: supplierIds,
			organizationId,
		});

		// Vérification que l'organizationId n'est pas vide
		if (!organizationId) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"L'ID de l'organisation est manquant"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Validation complète des données
		const validation = deleteMultipleSuppliersSchema.safeParse({
			ids: supplierIds,
			organizationId,
		});

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				{ ids: supplierIds, organizationId },
				"Validation échouée. Veuillez vérifier votre sélection."
			);
		}

		// 5. Vérification de l'existence des fournisseurs
		const existingSuppliers = await db.supplier.findMany({
			where: {
				id: { in: validation.data.ids },
				organizationId: validation.data.organizationId,
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

		// 6. Suppression
		await db.supplier.deleteMany({
			where: {
				id: { in: validation.data.ids },
				organizationId: validation.data.organizationId,
			},
		});

		// Revalidation du cache
		revalidateTag(`organization:${organizationId}:suppliers`);
		validation.data.ids.forEach((supplierId) => {
			revalidateTag(`organization:${organizationId}:supplier:${supplierId}`);
		});
		revalidateTag(`organization:${organizationId}:suppliers:count`);

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
}
