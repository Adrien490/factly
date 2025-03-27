# SelectFilter

Un composant de sélection permettant de filtrer les données avec des valeurs uniques, optimisé pour les sélections simples.

## Fonctionnalités

- Interface de sélection simple avec options prédéfinies
- Persistance des filtres via les paramètres d'URL
- Design unifié avec les autres composants de filtrage
- Gestion des états de chargement
- Intégration transparente avec le routeur Next.js
- Support pour la désélection et réinitialisation

## Installation

Le composant est disponible dans le dossier `shared/components/select-filter`.

## Utilisation

```tsx
import { SelectFilter } from "@/features/shared/components/select-filter";

// Options de filtre
const statusOptions = [
	{ value: "active", label: "Actif" },
	{ value: "inactive", label: "Inactif" },
	{ value: "pending", label: "En attente" },
];

export default function ClientsList() {
	return (
		<div className="flex gap-4 mb-6">
			<SelectFilter
				filterKey="status"
				label="Statut"
				options={statusOptions}
				placeholder="Tous les statuts"
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

## Hook: useSelectFilter

Gère l'état de sélection et la synchronisation avec les paramètres d'URL.

```tsx
import { useSelectFilter } from "@/features/shared/components/select-filter/hooks";

function MonFiltre() {
	const { value, setFilter, clearFilter, isPending } =
		useSelectFilter("category");

	return (
		<div>
			<label>Catégorie</label>
			<select
				value={value}
				onChange={(e) => setFilter(e.target.value)}
				disabled={isPending}
			>
				<option value="">Toutes les catégories</option>
				<option value="tech">Technologie</option>
				<option value="health">Santé</option>
				<option value="finance">Finance</option>
			</select>

			{value && (
				<button onClick={clearFilter} disabled={isPending}>
					Réinitialiser
				</button>
			)}
		</div>
	);
}
```

## Structure des fichiers

```
select-filter/
├── components/        # Composants UI
│   ├── index.ts
│   └── select-filter.tsx
├── hooks/             # Logique et état
│   ├── index.ts
│   └── use-select-filter.ts
├── types/             # Types TypeScript
│   └── index.ts
└── index.ts           # Point d'entrée
```

## Dépendances

- Next.js (useRouter, useSearchParams)
- React (useTransition, useOptimistic)
- Radix UI / Shadcn (composants Select)
- Lucide React (icônes)
