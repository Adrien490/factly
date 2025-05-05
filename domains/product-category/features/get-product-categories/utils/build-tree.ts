import { ProductCategoryFlat, ProductCategoryTree } from "../types";

/**
 * Construit une arborescence de catégories à partir d'une liste plate
 * @param categories Liste plate de catégories
 * @param parentId ID du parent à partir duquel construire l'arborescence (null pour les catégories racines)
 * @returns Liste hiérarchique de catégories avec leurs enfants
 */
export function buildCategoryTree(
	categories: ProductCategoryFlat[],
	parentId: string | null = null
): ProductCategoryTree[] {
	// Filtrer pour obtenir les catégories du niveau demandé
	const rootCategories = categories.filter(
		(category) => category.parentId === parentId
	);

	// Pour chaque catégorie de ce niveau, trouver et ajouter récursivement ses enfants
	return rootCategories.map((category) => {
		const children = buildCategoryTree(categories, category.id);

		// Retourner la catégorie avec ses enfants
		return {
			...category,
			childCount: children.length,
			hasChildren: children.length > 0,
			children: children.length > 0 ? children : undefined,
		};
	});
}
