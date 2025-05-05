import { BreadcrumbItem } from "@/shared/components/breadcrumbs/types";
import { GetProductCategoriesReturn } from "../features/get-product-categories/types";

/**
 * Trouve une catégorie par son chemin d'URL
 * @param categories - Liste des catégories
 * @param pathSegments - Segments du chemin d'URL (slugs)
 * @returns La catégorie correspondante ou undefined si non trouvée
 */
export async function getCategoryByPath(
	categories: GetProductCategoriesReturn["categories"],
	pathSegments: string[]
): Promise<GetProductCategoriesReturn["categories"][number] | undefined> {
	if (!pathSegments.length) return undefined;

	// Le dernier segment est le slug de la catégorie que nous recherchons
	const targetSlug = pathSegments[pathSegments.length - 1];

	// Trouver la catégorie correspondant au slug cible
	return categories.find((category) => category.slug === targetSlug);
}

/**
 * Construit un chemin complet pour une catégorie, incluant tous ses parents
 * @param categories - Liste de toutes les catégories
 * @param currentCategory - Catégorie actuelle
 * @returns Tableau d'éléments breadcrumb
 */
export function buildCategoryPath(
	categories: GetProductCategoriesReturn["categories"],
	currentCategory: GetProductCategoriesReturn["categories"][number]
): BreadcrumbItem[] {
	const breadcrumbItems: BreadcrumbItem[] = [];
	const organizationId = currentCategory.organizationId;

	// Ajouter la catégorie courante
	breadcrumbItems.unshift({
		label: currentCategory.name,
		href: undefined, // Pas de lien pour la catégorie courante
	});

	// Fonction récursive pour ajouter les parents
	function addParent(categoryId: string | null): void {
		if (!categoryId) return;

		const parentCategory = categories.find((cat) => cat.id === categoryId);
		if (!parentCategory) return;

		// Construire le chemin pour cette catégorie
		const path = buildPathString(categories, parentCategory);

		// Ajouter le parent au début du breadcrumb
		breadcrumbItems.unshift({
			label: parentCategory.name,
			href: `/dashboard/${organizationId}/products/categories/${path}`,
		});

		// Continuer avec le parent du parent
		if (parentCategory.parentId) {
			addParent(parentCategory.parentId);
		}
	}

	// Commencer par le parent de la catégorie courante
	if (currentCategory.parentId) {
		addParent(currentCategory.parentId);
	}

	return breadcrumbItems;
}

/**
 * Construit le chemin complet d'une catégorie (tous les slugs des parents + le slug de la catégorie)
 * @param categories - Liste de toutes les catégories
 * @param category - Catégorie pour laquelle construire le chemin
 * @returns Chaîne de caractères représentant le chemin complet
 */
export function buildPathString(
	categories: GetProductCategoriesReturn["categories"],
	category: GetProductCategoriesReturn["categories"][number]
): string {
	const slugs: string[] = [category.slug];

	let currentCat = category;
	while (currentCat.parentId) {
		const parent = categories.find((cat) => cat.id === currentCat.parentId);
		if (!parent) break;

		slugs.unshift(parent.slug);
		currentCat = parent;
	}

	return slugs.join("/");
}

/**
 * Analyse l'URL pour extraire les slugs de catégories
 * @param url - URL à analyser
 * @returns Tableau des slugs de catégories
 */
export function extractCategorySlugsFromUrl(url: string): string[] {
	// Supprimer tout ce qui précède "/categories/"
	const match = url.match(/\/categories\/(.+)$/);
	if (!match || !match[1]) return [];

	// Diviser le reste en segments
	return match[1].split("/").filter(Boolean);
}
