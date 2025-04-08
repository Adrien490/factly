# SearchForm

Un composant de formulaire de recherche réutilisable avec gestion optimisée des états de chargement et intégration avec les paramètres d'URL.

## Fonctionnalités

- Champ de recherche avec effacement facile
- Gestion du debounce pour limiter les requêtes
- Mise à jour des paramètres d'URL
- Affichage des états de chargement
- Transitions optimistes pour une meilleure UX
- Design responsive et accessible
- Support pour les soumissions via la touche Entrée

## Installation

Le composant est disponible dans le dossier `shared/components/search-form`.

## Utilisation

```tsx
import { SearchForm } from "@/shared/components/search-form";

export default function ClientsList() {
	return (
		<div>
			<div className="flex justify-between mb-4">
				<h1>Liste des clients</h1>
				<SearchForm placeholder="Rechercher un client..." className="w-64" />
			</div>

			{/* Tableau ou liste de résultats */}
		</div>
	);
}
```

## Props

| Prop          | Type                        | Description                        | Requis | Par défaut        |
| ------------- | --------------------------- | ---------------------------------- | ------ | ----------------- |
| `placeholder` | `string`                    | Texte d'indication dans le champ   | Non    | `"Rechercher..."` |
| `className`   | `string`                    | Classes CSS additionnelles         | Non    | `undefined`       |
| `debounceMs`  | `number`                    | Délai de debounce en millisecondes | Non    | `300`             |
| `size`        | `"default" \| "sm" \| "lg"` | Taille du champ de recherche       | Non    | `"default"`       |
| `paramName`   | `string`                    | Nom du paramètre d'URL             | Non    | `"search"`        |
| `onSearch`    | `(value: string) => void`   | Fonction appelée à la recherche    | Non    | `undefined`       |

## Hook: useSearch

Gère l'état de recherche, le debounce et la mise à jour des paramètres d'URL.

```tsx
import { useSearch } from "@/sharedts/search-form/hooks";

function MonComposantRecherche() {
	const { searchValue, setSearchValue, isPending, handleClear } = useSearch({
		paramName: "q",
		debounceMs: 500,
	});

	return (
		<div className="flex gap-2">
			<input
				type="text"
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				placeholder="Rechercher..."
			/>

			{searchValue && (
				<button onClick={handleClear} disabled={isPending}>
					Effacer
				</button>
			)}

			{isPending && <span>Recherche en cours...</span>}
		</div>
	);
}
```

### Options du hook

| Option       | Type                      | Description                        | Requis | Par défaut  |
| ------------ | ------------------------- | ---------------------------------- | ------ | ----------- |
| `paramName`  | `string`                  | Nom du paramètre d'URL             | Non    | `"search"`  |
| `debounceMs` | `number`                  | Délai de debounce en millisecondes | Non    | `300`       |
| `onSearch`   | `(value: string) => void` | Callback appelé à la recherche     | Non    | `undefined` |

### Retour du hook

| Propriété        | Type                      | Description                           |
| ---------------- | ------------------------- | ------------------------------------- |
| `searchValue`    | `string`                  | Valeur actuelle du champ de recherche |
| `setSearchValue` | `(value: string) => void` | Fonction pour mettre à jour la valeur |
| `isPending`      | `boolean`                 | Indique si une recherche est en cours |
| `handleClear`    | `() => void`              | Fonction pour effacer la recherche    |
| `handleSubmit`   | `(e: FormEvent) => void`  | Fonction de soumission du formulaire  |

## Structure des fichiers

```
search-form/
├── components/        # Composants UI
│   ├── index.ts
│   └── search-form.tsx
├── hooks/             # Logique et état
│   ├── index.ts
│   └── use-search.ts
└── index.tsx          # Point d'entrée
```

## Dépendances

- Next.js (useRouter, useSearchParams)
- React (useEffect, useState, useTransition)
- Lucide React (icônes Search, X)
- Radix UI / Shadcn (composants Input, Button)
