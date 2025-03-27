"use server";

import { auth } from "@/features/auth/lib/auth";
import { hasOrganizationAccess } from "@/features/organization/has-access";
import db from "@/features/shared/lib/db";
import { headers } from "next/headers";

/**
 * Récupère toutes les années fiscales d'une organisation
 * @param organizationId ID de l'organisation
 */
export async function fetchFiscalYears(organizationId: string) {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			throw new Error(
				"Vous devez être connecté pour accéder aux années fiscales"
			);
		}

		// 2. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId.toString());
		if (!hasAccess) {
			throw new Error("Vous n'avez pas accès à cette organisation");
		}

		// 3. Récupération des années fiscales triées par date de début (de la plus récente à la plus ancienne)
		const fiscalYears = await db.fiscalYear.findMany({
			where: {
				organizationId: organizationId,
			},
			orderBy: {
				startDate: "desc",
			},
			// Utiliser la relation correcte selon votre modèle Prisma
			// Ajustez selon votre schéma
			// include: {
			// 	user: {
			// 		select: {
			// 			id: true,
			// 			name: true,
			// 			email: true,
			// 		},
			// 	},
			// },
		});

		// 4. Retour des années fiscales
		return fiscalYears;
	} catch (error) {
		console.error("[FETCH_FISCAL_YEARS]", error);
		throw error;
	}
}
