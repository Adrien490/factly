# SelectionToolbar

Une barre d'outils contextuelle qui apparaît lorsque des éléments sont sélectionnés dans une liste ou un tableau, permettant d'effectuer des actions groupées.

## Fonctionnalités

- Apparaît automatiquement lorsque des éléments sont sélectionnés
- Affiche le nombre d'éléments sélectionnés
- Bouton pour désélectionner tous les éléments
- Support pour des actions personnalisables sur la sélection
- Animation fluide d'apparition/disparition
- Design adaptatif (responsive)

## Installation

Le composant est disponible dans le dossier `shared/components/selection-toolbar`.

## Utilisation

```tsx
import { SelectionToolbar } from "@/shared/components/selection-toolbar";
import { useSelection } from "@/sharedts/selection-toolbar/hooks";

export default function ClientsList() {
	const { selectedItems, handleClearSelection } = useSelection("clients");

	// Actions sur la sélection
	const deleteSelectedClients = () => {
		// Logique de suppression
		handleClearSelection();
	};

	const actions = (
		<>
			<Button onClick={deleteSelectedClients} variant="destructive">
				Supprimer
			</Button>
			<Button variant="outline">Exporter</Button>
		</>
	);

	return (
		<div className="relative">
			<SelectionToolbar selectedItems={selectedItems} actions={actions} />

			{/* Table ou liste de clients */}
		</div>
	);
}
```

## Props

| Prop            | Type              | Description                               | Requis | Par défaut  |
| --------------- | ----------------- | ----------------------------------------- | ------ | ----------- |
| `selectedItems` | `string[]`        | IDs des éléments sélectionnés             | Oui    | -           |
| `actions`       | `React.ReactNode` | Actions à afficher dans la barre d'outils | Non    | `undefined` |
| `className`     | `string`          | Classes CSS additionnelles                | Non    | `undefined` |

## Hook: useSelection

Gère l'état de sélection des éléments d'une liste.

```tsx
import { useSelection } from "@/sharedts/selection-toolbar/hooks";

function MaListe() {
	// "clients" est une clé unique pour identifier cette sélection
	const {
		selectedItems,
		isSelected,
		handleItemSelectionChange,
		handleSelectionChange,
		areAllSelected,
		handleClearSelection,
	} = useSelection("clients");

	const items = ["id1", "id2", "id3"];

	return (
		<div>
			<div className="flex items-center">
				<input
					type="checkbox"
					checked={areAllSelected(items)}
					onChange={(e) => handleSelectionChange(items, e.target.checked)}
				/>
				<span>Tout sélectionner</span>
			</div>

			<ul>
				{items.map((id) => (
					<li key={id}>
						<input
							type="checkbox"
							checked={isSelected(id)}
							onChange={(e) => handleItemSelectionChange(id, e.target.checked)}
						/>
						{id}
					</li>
				))}
			</ul>
		</div>
	);
}
```

### Retour du hook

| Propriété                   | Type                                         | Description                                                |
| --------------------------- | -------------------------------------------- | ---------------------------------------------------------- |
| `selectedItems`             | `string[]`                                   | Liste des IDs des éléments sélectionnés                    |
| `isSelected`                | `(id: string) => boolean`                    | Vérifie si un élément est sélectionné                      |
| `handleItemSelectionChange` | `(id: string, selected: boolean) => void`    | Change l'état de sélection d'un élément                    |
| `handleSelectionChange`     | `(ids: string[], selected: boolean) => void` | Change l'état de sélection de plusieurs éléments           |
| `areAllSelected`            | `(ids: string[]) => boolean`                 | Vérifie si tous les éléments d'une liste sont sélectionnés |
| `handleClearSelection`      | `() => void`                                 | Efface toute la sélection                                  |

## Structure des fichiers

```
selection-toolbar/
├── components/        # Composants UI
│   ├── index.ts
│   └── selection-toolbar.tsx
├── hooks/             # Logique et état
│   ├── index.ts
│   └── use-selection.ts
├── types/             # Types TypeScript
│   └── index.ts
└── index.tsx          # Point d'entrée
```

## Dépendances

- React (hooks: useEffect, useState)
- Lucide React (icônes)
- Radix UI / Shadcn (composants UI de base)
- TanStack/React-Query (pour la persistance entre les rendus)
