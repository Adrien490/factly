# FilterSelect

Un composant de sélection avec filtrage conçu pour simplifier le filtrage des listes de données et l'intégration avec les paramètres d'URL.

## Fonctionnalités

- Interface de sélection avec options prédéfinies
- Persistance des filtres via les paramètres d'URL
- Design unifié avec les autres composants de filtrage
- Support pour les sélections simples et multiples
- Gestion des états de chargement
- Intégration transparente avec le routeur Next.js
- Support pour la désélection et réinitialisation

## Installation

Le composant est disponible dans le dossier `shared/components/filter-select`.

## Utilisation

```tsx
import { FilterSelect } from "@/shared/components/filter-select";

// Options de filtre
const statusOptions = [
	{ value: "active", label: "Actif" },
	{ value: "inactive", label: "Inactif" },
	{ value: "pending", label: "En attente" },
];

export default function ClientsList() {
	return (
		<div className="flex gap-4 mb-6">
			<FilterSelect
				label="Statut"
				paramName="status"
				options={statusOptions}
				placeholder="Tous les statuts"
			/>

			<FilterSelect
				label="Priorité"
				paramName="priority"
				options={[
					{ value: "high", label: "Haute" },
					{ value: "medium", label: "Moyenne" },
					{ value: "low", label: "Basse" },
				]}
				placeholder="Toutes les priorités"
				multiple
			/>
		</div>
	);
}
```

## Props

| Prop              | Type                                 | Description                                        | Requis | Par défaut          |
| ----------------- | ------------------------------------ | -------------------------------------------------- | ------ | ------------------- |
| `label`           | `string`                             | Étiquette du filtre                                | Oui    | -                   |
| `paramName`       | `string`                             | Nom du paramètre d'URL                             | Oui    | -                   |
| `options`         | `{ value: string; label: string }[]` | Options du filtre                                  | Oui    | -                   |
| `placeholder`     | `string`                             | Texte affiché quand aucun filtre n'est sélectionné | Non    | `"Sélectionner..."` |
| `multiple`        | `boolean`                            | Permet la sélection multiple                       | Non    | `false`             |
| `className`       | `string`                             | Classes CSS additionnelles                         | Non    | `undefined`         |
| `showClearButton` | `boolean`                            | Affiche un bouton pour effacer la sélection        | Non    | `true`              |

## Hook: useFilterSelect

Gère l'état de sélection et la synchronisation avec les paramètres d'URL.

```tsx
import { useFilterSelect } from "@/sharedts/filter-select/hooks";

function MonFiltre() {
	const { selectedValue, handleValueChange, isPending, handleReset } =
		useFilterSelect({
			paramName: "category",
			multiple: true,
		});

	const options = [
		{ value: "tech", label: "Technologie" },
		{ value: "health", label: "Santé" },
		{ value: "finance", label: "Finance" },
	];

	return (
		<div>
			<label>Catégories</label>
			<select
				multiple
				value={selectedValue ?? []}
				onChange={(e) => {
					const values = Array.from(
						e.target.selectedOptions,
						(option) => option.value
					);
					handleValueChange(values);
				}}
				disabled={isPending}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>

			{selectedValue && selectedValue.length > 0 && (
				<button onClick={handleReset} disabled={isPending}>
					Réinitialiser
				</button>
			)}
		</div>
	);
}
```

### Options du hook

| Option      | Type      | Description                                  | Requis | Par défaut |
| ----------- | --------- | -------------------------------------------- | ------ | ---------- |
| `paramName` | `string`  | Nom du paramètre d'URL                       | Oui    | -          |
| `multiple`  | `boolean` | Indique si la sélection multiple est activée | Non    | `false`    |

### Retour du hook

| Propriété           | Type                                          | Description                              |
| ------------------- | --------------------------------------------- | ---------------------------------------- |
| `selectedValue`     | `string \| string[] \| null`                  | Valeur(s) sélectionnée(s) ou null        |
| `handleValueChange` | `(value: string \| string[] \| null) => void` | Fonction pour changer la valeur          |
| `isPending`         | `boolean`                                     | Indique si une transition est en cours   |
| `handleReset`       | `() => void`                                  | Fonction pour réinitialiser la sélection |

## Structure des fichiers

```
filter-select/
├── components/        # Composants UI
│   ├── index.ts
│   └── filter-select.tsx
├── hooks/             # Logique et état
│   ├── index.ts
│   └── use-filter-select.ts
└── index.tsx          # Point d'entrée
```

## Dépendances

- Next.js (useRouter, useSearchParams)
- React (useTransition)
- Radix UI / Shadcn (composants Select)
- Lucide React (icônes)
