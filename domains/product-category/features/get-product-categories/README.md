# Get Product Categories

Cette fonctionnalité permet de récupérer les catégories de produits d'une organisation.

## Utilisation

```typescript
import { getProductCategories } from "@/domains/product-category/features/get-product-categories";

// Récupérer toutes les catégories
const allCategories = await getProductCategories({
	organizationId: "org_123",
});

// Récupérer uniquement les catégories racine
const rootCategories = await getProductCategories({
	organizationId: "org_123",
	rootOnly: true,
});

// Ou de manière équivalente
const rootCategoriesAlt = await getProductCategories({
	organizationId: "org_123",
	parentId: null,
});

// Récupérer les sous-catégories d'une catégorie spécifique
const childCategories = await getProductCategories({
	organizationId: "org_123",
	parentId: "cat_123",
});
```

## Paramètres

| Paramètre      | Type                        | Description                                                                                                                  | Valeur par défaut                   |
| -------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| organizationId | string                      | ID de l'organisation (obligatoire)                                                                                           | -                                   |
| search         | string                      | Terme de recherche                                                                                                           | undefined                           |
| filters        | object                      | Filtres à appliquer                                                                                                          | {}                                  |
| parentId       | string \| null \| undefined | ID de la catégorie parent. Si null, récupère uniquement les catégories racine. Si undefined, récupère toutes les catégories. | undefined                           |
| rootOnly       | boolean                     | Si true, force parentId à null pour récupérer uniquement les catégories racine                                               | false                               |
| sortBy         | "name" \| "createdAt"       | Champ sur lequel trier                                                                                                       | "name"                              |
| sortOrder      | "asc" \| "desc"             | Ordre de tri                                                                                                                 | "asc"                               |
| include        | object                      | Options d'inclusion                                                                                                          | { childCount: true, parent: false } |

## Structure de la réponse

```typescript
type ProductCategory = {
	id: string;
	organizationId: string;
	name: string;
	description: string | null;
	slug: string;
	status: string;
	parentId: string | null;
	createdAt: Date;
	updatedAt: Date;
	parent?: {
		id: string;
		name: string;
		slug: string;
	};
	childCount?: number;
	hasChildren?: boolean;
};
```
