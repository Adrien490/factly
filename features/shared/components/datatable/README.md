# DataTable

Un composant de tableau de données avancé avec support pour la sélection, le tri, la pagination, les actions par ligne et divers alignements de colonnes.

## Fonctionnalités

- Tableau de données avec support de types génériques TypeScript
- Colonnes personnalisables (alignement, visibilité, tri)
- Sélection d'éléments avec support pour les actions groupées
- Actions contextuelles par ligne
- Intégration avec la toolbar de sélection
- Pagination intégrée
- État vide personnalisé
- Support pour les états de chargement
- Tri des colonnes
- Accessibilité renforcée (attributs ARIA)
- Validation des props avec Zod

## Installation

Le composant est disponible dans le dossier `shared/components/datatable`.

## Utilisation

### Exemple basique

```tsx
import { DataTable, ColumnDef } from "@/features/shared/components/datatable";
import { formatDate } from "@/features/shared/lib/format-date";

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
			ariaLabel="Liste des clients"
		/>
	);
}
```

### Exemple avec actions par ligne

```tsx
import { DataTable, ColumnDef } from "@/features/shared/components/datatable";
import { Edit, Trash, Eye, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

interface User {
	id: string;
	name: string;
	email: string;
	role: "admin" | "user";
}

const columns: ColumnDef<User>[] = [
	{
		id: "name",
		header: "Nom",
		cell: (user) => user.name,
	},
	{
		id: "email",
		header: "Email",
		cell: (user) => user.email,
	},
	{
		id: "role",
		header: "Rôle",
		cell: (user) => user.role,
		// Actions définies à l'intérieur de la colonne
		actions: [
			{
				label: "Voir",
				icon: <Eye className="h-4 w-4" />,
				onClick: (user) => {
					toast.info(`Visualisation de ${user.name}`);
				},
				ariaLabel: (user) => `Voir les détails de ${user.name}`,
			},
			{
				label: "Modifier",
				icon: <Edit className="h-4 w-4" />,
				onClick: (user) => {
					toast.info(`Modification de ${user.name}`);
				},
				// L'action est activée uniquement pour les administrateurs
				isVisible: (user) => user.role === "admin",
			},
			{
				label: "Supprimer",
				icon: <Trash className="h-4 w-4" />,
				onClick: (user) => {
					toast.info(`Suppression de ${user.name}`);
				},
				variant: "destructive",
				// L'action est désactivée dans certaines conditions
				disabled: (user) => user.role === "admin",
				ariaLabel: "Supprimer cet utilisateur",
			},
		],
	},
];

const users: User[] = [
	{ id: "1", name: "John Doe", email: "john@example.com", role: "admin" },
	{ id: "2", name: "Jane Smith", email: "jane@example.com", role: "user" },
];

export default function UsersPage() {
	return (
		<DataTable
			data={users}
			columns={columns}
			ariaLabel="Liste des utilisateurs"
		/>
	);
}
```

## Props

| Prop         | Type                                         | Description                                     | Requis | Par défaut             |
| ------------ | -------------------------------------------- | ----------------------------------------------- | ------ | ---------------------- |
| `data`       | `T[]`                                        | Tableau de données à afficher                   | Oui    | -                      |
| `columns`    | `ColumnDef<T>[]`                             | Définition des colonnes                         | Oui    | -                      |
| `selection`  | `{ key: string; actions?: React.ReactNode }` | Configuration de la sélection                   | Non    | `undefined`            |
| `getItemId`  | `(item: T) => string`                        | Fonction pour extraire l'ID unique d'un élément | Non    | `item => item.id`      |
| `pagination` | `object`                                     | Configuration de la pagination                  | Non    | -                      |
| `ariaLabel`  | `string`                                     | Label d'accessibilité pour le tableau           | Non    | `"Tableau de données"` |
| `onRowClick` | `(item: T) => void`                          | Fonction appelée lorsqu'une ligne est cliquée   | Non    | -                      |

## ColumnDef (Configuration des colonnes)

| Propriété    | Type                                | Description                                  | Requis | Par défaut  |
| ------------ | ----------------------------------- | -------------------------------------------- | ------ | ----------- |
| `id`         | `string`                            | Identifiant unique de la colonne             | Oui    | -           |
| `header`     | `string \| () => React.ReactNode`   | Titre de la colonne ou une fonction de rendu | Oui    | -           |
| `cell`       | `(item: T) => React.ReactNode`      | Fonction de rendu de la cellule              | Oui    | -           |
| `visibility` | `"always" \| "tablet" \| "desktop"` | Visibilité responsive                        | Non    | `"always"`  |
| `align`      | `"left" \| "center" \| "right"`     | Alignement du contenu                        | Non    | `"left"`    |
| `sortable`   | `boolean`                           | Si la colonne est triable                    | Non    | `false`     |
| `actions`    | `RowAction<T>[]`                    | Actions disponibles pour cette colonne       | Non    | `undefined` |

## RowAction (Configuration des actions par ligne)

| Propriété   | Type                                | Description                         | Requis | Par défaut  |
| ----------- | ----------------------------------- | ----------------------------------- | ------ | ----------- |
| `label`     | `string`                            | Texte affiché pour l'action         | Oui    | -           |
| `icon`      | `React.ReactNode`                   | Icône à afficher avant le label     | Non    | `undefined` |
| `onClick`   | `(item: T) => void`                 | Fonction appelée lors du clic       | Oui    | -           |
| `disabled`  | `boolean \| (item: T) => boolean`   | Si l'action est désactivée          | Non    | `false`     |
| `isVisible` | `(item: T) => boolean`              | Si l'action doit être affichée      | Non    | `true`      |
| `variant`   | `"default" \| "destructive" \| ...` | Variante visuelle du bouton         | Non    | `"default"` |
| `ariaLabel` | `string \| (item: T) => string`     | Label d'accessibilité pour l'action | Non    | `label`     |

## Hooks associés

### useSelection

Gère la sélection des éléments et l'état de la sélection.

### useSorting

Gère l'état de tri des colonnes en se synchronisant avec les paramètres d'URL.

### usePagination

Gère l'état de pagination en se synchronisant avec les paramètres d'URL.

## Validation avec Zod

Le composant utilise Zod pour valider les propriétés et générer des types TypeScript cohérents. Cela permet de :

- Valider les données à l'exécution
- Bénéficier de types précis et générés automatiquement
- Éviter les erreurs courantes grâce à la validation de schéma

```tsx
import { dataTableSchema } from "@/features/shared/components/datatable/schemas/data-table-schema";

// Validation des props à l'exécution
const validateProps = (props) => {
	try {
		dataTableSchema.parse(props);
		return true;
	} catch (error) {
		console.error("Erreur de validation:", error);
		return false;
	}
};
```

## Accessibilité

Le composant DataTable implémente les bonnes pratiques d'accessibilité :

- Utilisation appropriée des rôles ARIA (`grid`, `row`, `columnheader`, `gridcell`)
- Support complet de la navigation au clavier
- Attributs `aria-sort` pour indiquer l'état de tri des colonnes
- Labels ARIA pour les contrôles interactifs (checkboxes, boutons d'action)
- États de sélection (`data-state="selected"`) pour les styles et les lecteurs d'écran
- Éléments visuellement cachés (`sr-only`) pour les informations destinées aux lecteurs d'écran

## Structure des fichiers

```
datatable/
├── components/        # Composants UI
│   ├── index.ts
│   ├── datatable.tsx
│   ├── pagination/
│   └── selection/
│       └── selection-toolbar/
├── hooks/             # Logique et état
│   ├── use-selection.ts
│   ├── use-sorting.ts
│   └── use-pagination.ts
├── schemas/           # Validation Zod
│   └── data-table-schema.ts
├── types/             # Types TypeScript
│   └── index.ts
├── constants/         # Constantes et utilitaires
│   └── index.ts
└── index.tsx          # Point d'entrée
```

## Dépendances

- React
- Lucide React (icônes)
- Pagination (composant interne)
- SelectionToolbar (composant interne)
- Composants UI de base (Checkbox, Table, etc.)
- Zod (validation de schéma)
