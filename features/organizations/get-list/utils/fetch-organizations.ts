import db from "@/shared/lib/db";
import { DEFAULT_SELECT } from "../constants";
import { getOrganizationsSchema } from "../schemas";
import { GetOrganizationsParams, GetOrganizationsReturn } from "../types";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction interne cacheable qui récupère les organisations
 * Prend directement l'ID utilisateur au lieu de l'extraire des headers
 */
export async function fetchOrganizations(
	params: GetOrganizationsParams,
	userId: string
): Promise<GetOrganizationsReturn> {
	try {
		// Validation des paramètres
		const validation = getOrganizationsSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;
		const where = buildWhereClause(validatedParams, userId);

		// Récupération des organisations
		const organizations = await db.organization.findMany({
			where,
			select: DEFAULT_SELECT,
			orderBy: { [validatedParams.sortBy]: validatedParams.sortOrder },
		});

		return organizations;
	} catch (error) {
		console.error("[FETCH_ORGANIZATIONS]", error);
		// Retourne un tableau vide en cas d'erreur
		return [];
	}
}
