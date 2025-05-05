import { z } from "zod";
import { getProductCategoryAncestorsSchema } from "../schemas";

/**
 * Type pour un ancêtre de catégorie - version simplifiée avec uniquement
 * les informations nécessaires pour l'affichage et la navigation
 */
export type CategoryAncestor = {
	id: string;
	name: string;
	slug: string;
	parentId: string | null;
};

/**
 * Type de retour pour getAncestors
 * Liste d'ancêtres ordonnés du plus proche au plus éloigné
 */
export type GetProductCategoryAncestorsReturn = CategoryAncestor[];

/**
 * Type pour les paramètres de la fonction
 */
export type GetProductCategoryAncestorsParams = z.infer<
	typeof getProductCategoryAncestorsSchema
>;
