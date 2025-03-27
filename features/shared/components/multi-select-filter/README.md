# MultiSelectFilter

Un composant de sélection permettant de filtrer les données avec des valeurs multiples, optimisé pour les cas où plusieurs options peuvent être sélectionnées simultanément.

## Fonctionnalités

- Interface de sélection multiple avec options prédéfinies
- Affichage des sélections multiples sous forme de badges
- Persistance des filtres via les paramètres d'URL
- Recherche intégrée dans les options
- Gestion des états de chargement
- Intégration transparente avec le routeur Next.js
- Support pour la désélection et réinitialisation

## Installation

Le composant est disponible dans le dossier `shared/components/multi-select-filter`.

## Utilisation

```tsx
import { MultiSelectFilter } from "@/features/shared/components/multi-select-filter";

// Options de filtre
const priorityOptions = [
	{ value: "high", label: "Haute" },
	{ value: "medium", label: "Moyenne" },
	{ value: "low", label: "Basse" },
];

export default function ClientsList() {
	return (
		<div className="flex gap-4 mb-6">
			<MultiSelectFilter
				filterKey="priority"
				label="Priorité"
				options={priorityOptions}
				placeholder="Toutes les priorités"
			/>
		</div>
	);
}
```

## Props

| Prop          | Type                                 | Description                                        | Requis | Par défaut          |
| ------------- | ------------------------------------ | -------------------------------------------------- | ------ | ------------------- |
| `filterKey`   | `string`                             | Clé unique pour identifier ce filtre dans l'URL    | Oui    | -                   |
| `label`       | `string`                             | Étiquette du filtre                                | Oui    | -                   |
| `options`     | `{ value: string; label: string }[]` | Options du filtre                                  | Oui    | -                   |
| `placeholder` | `string`                             | Texte affiché quand aucun filtre n'est sélectionné | Non    | `"Sélectionner..."` |
| `className`   | `string`                             | Classes CSS additionnelles                         | Non    | `undefined`         |
| `maxHeight`   | `number`                             | Hauteur maximale du menu déroulant en pixels       | Non    | `250`               |

## Hook: useMultiSelectFilter

Gère l'état de sélection multiple et la synchronisation avec les paramètres d'URL.

```tsx
import { useMultiSelectFilter } from "@/features/shared/components/multi-select-filter/hooks";

function MonFiltre() {
	const { values, toggleValue, setFilter, clearFilter, isSelected, isPending } =
		useMultiSelectFilter("category");

	const options = [
		{ value: "tech", label: "Technologie" },
		{ value: "health", label: "Santé" },
		{ value: "finance", label: "Finance" },
	];

	return (
		<div>
			<div className="flex flex-col gap-2">
				{options.map((option) => (
					<label key={option.value} className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={isSelected(option.value)}
							onChange={() => toggleValue(option.value)}
							disabled={isPending}
						/>
						{option.label}
					</label>
				))}
			</div>

			{values.length > 0 && (
				<button onClick={clearFilter} disabled={isPending}>
					Réinitialiser les filtres
				</button>
			)}
		</div>
	);
}
```

## Structure des fichiers

```
multi-select-filter/
├── components/        # Composants UI
│   ├── index.ts
│   └── multi-select-filter.tsx
├── hooks/             # Logique et état
│   ├── index.ts
│   └── use-multi-select-filter.ts
├── types/             # Types TypeScript
│   └── index.ts
└── index.ts           # Point d'entrée
```

## Dépendances

- Next.js (useRouter, useSearchParams)
- React (useTransition, useOptimistic)
- Radix UI / Shadcn (composants Command, Popover)
- Lucide React (icônes)
