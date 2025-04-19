# DataTableToolbar

Une barre d'outils responsive pour les tables de données, permettant d'organiser les éléments de contrôle en deux groupes : gauche et droite.

## Fonctionnalités

- Structure responsive avec flex-wrap
- Organisation en deux sections (gauche et droite)
- Espacement cohérent entre les éléments
- Adapté pour contenir des éléments de recherche, filtres, boutons d'action, etc.
- Compatible avec tous les types de tables de données

## Installation

Le composant est disponible dans le dossier `shared/components/datatable/datatable-toolbar`.

## Utilisation

```tsx
import {
	DataTableToolbar,
	SearchForm,
	SortingOptionsDropdown,
	Button,
} from "@/shared/components";
import { RefreshButton } from "@/domains/example/features";

export default function ExampleList() {
	return (
		<DataTableToolbar
			leftContent={
				<>
					<SearchForm
						paramName="search"
						placeholder="Rechercher..."
						className="w-[275px] shrink-0 sm:w-[200px] lg:w-[275px]"
					/>
					<RefreshButton organizationId={organizationId} />
				</>
			}
			rightContent={
				<>
					<SortingOptionsDropdown
						sortFields={SORT_FIELDS}
						defaultSortBy="createdAt"
						defaultSortOrder="desc"
						className="w-[200px] shrink-0"
					/>
					<Button variant="outline">Filtres</Button>
					<Button asChild>
						<Link href="/new">Nouveau</Link>
					</Button>
				</>
			}
		/>
	);
}
```

## Props

| Prop           | Type              | Description                            | Requis | Par défaut  |
| -------------- | ----------------- | -------------------------------------- | ------ | ----------- |
| `leftContent`  | `React.ReactNode` | Éléments à afficher sur le côté gauche | Non    | `undefined` |
| `rightContent` | `React.ReactNode` | Éléments à afficher sur le côté droit  | Non    | `undefined` |
| `className`    | `string`          | Classes CSS additionnelles             | Non    | `""`        |

</rewritten_file>
