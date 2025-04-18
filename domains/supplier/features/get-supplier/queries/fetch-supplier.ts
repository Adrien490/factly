"use server";

import db from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_SUPPLIER_DEFAULT_SELECT } from "../constants";
import { getSupplierSchema } from "../schemas";
import { GetSupplierReturn } from "../types";

/**
 * Récupère un fournisseur par ID avec cache
 */
export async function fetchSupplier(
	params: z.infer<typeof getSupplierSchema>
): Promise<GetSupplierReturn> {
	"use cache";

	// Tags de cache
	cacheTag(`organization:${params.organizationId}:supplier:${params.id}`);
	cacheLife({
		revalidate: 60 * 60 * 24, // 24 heures
		stale: 60 * 60 * 24, // 24 heures
		expire: 60 * 60 * 24 * 7, // 7 jours
	});

	try {
		// Récupération du fournisseur
		const supplier = await db.supplier.findFirst({
			where: {
				id: params.id,
				organizationId: params.organizationId,
			},
			select: GET_SUPPLIER_DEFAULT_SELECT,
		});

		if (!supplier) {
			throw new Error("Fournisseur non trouvé");
		}

		return supplier;
	} catch (error) {
		console.error("[FETCH_SUPPLIER]", error);
		throw error;
	}
}
