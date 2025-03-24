# DataTable

Un composant de tableau de données avancé avec support pour la sélection, le tri, la pagination et divers alignements de colonnes.

## Fonctionnalités

- Tableau de données avec support de types génériques TypeScript
- Colonnes personnalisables (alignement, visibilité, tri)
- Sélection d'éléments avec support pour les actions groupées
- Intégration avec la toolbar de sélection
- Pagination intégrée
- État vide personnalisé
- Support pour les états de chargement
- Tri des colonnes

## Installation

Le composant est disponible dans le dossier `shared/components/datatable`.

## Utilisation

```tsx
import { DataTable, ColumnDef } from "@/shared/components/datatable";
import { formatDate } from "@/shared/lib/format-date";

// Type de données à afficher
interface Client {
	id: string;
	name: string;
	email: string;
	createdAt: Date;
}

// Définition des colonnes
const columns: ColumnDef<Client>[] = [
	{
		id: "name",
		header: "Nom",
		cell: (client) => client.name,
		sortable: true,
	},
	{
		id: "email",
		header: "Email",
		cell: (client) => client.email,
		visibility: "tablet", // Visible sur tablette et desktop seulement
	},
	{
		id: "createdAt",
		header: "Date de création",
		cell: (client) => formatDate(client.createdAt),
		align: "right",
		sortable: true,
	},
];

// Données à afficher
const clients: Client[] = [
	/* ... données ... */
];

export default function ClientsPage() {
	return (
		<DataTable
			data={clients}
			columns={columns}
			selection={{
				key: "clients",
				actions: <button>Supprimer la sélection</button>,
			}}
			pagination={{
				total: 100,
				pageCount: 10,
				page: 1,
				perPage: 10,
			}}
		/>
	);
}
```

## Props

| Prop         | Type                                         | Description                                    | Requis | Par défaut          |
| ------------ | -------------------------------------------- | ---------------------------------------------- | ------ | ------------------- |
| `data`       | `T[]`                                        | Tableau de données à afficher                  | Oui    | -                   |
| `columns`    | `ColumnDef<T>[]`                             | Définition des colonnes                        | Oui    | -                   |
| `selection`  | `{ key: string; actions?: React.ReactNode }` | Configuration de la sélection                  | Non    | `undefined`         |
| `getItemId`  | `(item: T) => string`                        | Fonction pour obtenir l'ID unique d'un élément | Non    | `(item) => item.id` |
| `pagination` | `PaginationProps`                            | Configuration de la pagination                 | Non    | `undefined`         |

## ColumnDef (Configuration des colonnes)

| Propriété    | Type                                | Description                                  | Requis | Par défaut |
| ------------ | ----------------------------------- | -------------------------------------------- | ------ | ---------- |
| `id`         | `string`                            | Identifiant unique de la colonne             | Oui    | -          |
| `header`     | `string \| () => React.ReactNode`   | Titre de la colonne ou une fonction de rendu | Oui    | -          |
| `cell`       | `(item: T) => React.ReactNode`      | Fonction de rendu de la cellule              | Oui    | -          |
| `visibility` | `"always" \| "tablet" \| "desktop"` | Visibilité responsive                        | Non    | `"always"` |
| `align`      | `"left" \| "center" \| "right"`     | Alignement du contenu                        | Non    | `"left"`   |
| `sortable`   | `boolean`                           | Si la colonne est triable                    | Non    | `false`    |

## Hooks associés

### useSelection

Gère la sélection des éléments et l'état de la sélection.

### useSorting

Gère l'état de tri des colonnes en se synchronisant avec les paramètres d'URL.

## Structure des fichiers

```
datatable/
├── components/        # Composants UI
│   ├── index.ts
│   └── datatable.tsx
├── hooks/             # Logique et état
│   └── use-datatable.ts (si applicable)
├── schemas/           # Validation Zod (si applicable)
├── types/             # Types TypeScript
│   └── index.ts       # Définitions des types pour ColumnDef, etc.
└── index.tsx          # Point d'entrée
```

## Dépendances

- React
- Lucide React (icônes)
- Pagination (composant interne)
- SelectionToolbar (composant interne)
- Composants UI de base (Checkbox, Table, etc.)
