# Pagination

Composant de pagination avancé pour la navigation dans les listes de données avec support pour les paramètres d'URL.

## Fonctionnalités

- Navigation par page (première, précédente, suivante, dernière)
- Affichage intelligent des numéros de page (réduit pour les grandes séries)
- Sélecteur de nombre d'éléments par page (10, 20, 50, 100)
- Affichage responsive (adapté mobile et desktop)
- Intégration avec les paramètres d'URL pour la persistance
- Affichage des informations de pagination (X-Y sur Z éléments)
- Support pour les états de chargement avec affichage optimiste

## Installation

Le composant est disponible dans le dossier `shared/components/pagination`.

## Utilisation

```tsx
import { Pagination } from "@/shared/components/pagination";

export default function ListePage() {
	// Ces valeurs peuvent venir de l'URL ou d'une API
	const total = 100; // Nombre total d'éléments
	const pageCount = 10; // Nombre total de pages
	const page = 1; // Page actuelle
	const perPage = 10; // Nombre d'éléments par page

	return (
		<div>
			{/* Votre liste de données ici */}

			<Pagination
				total={total}
				pageCount={pageCount}
				page={page}
				perPage={perPage}
			/>
		</div>
	);
}
```

## Props

| Prop        | Type     | Description                | Requis | Par défaut |
| ----------- | -------- | -------------------------- | ------ | ---------- |
| `total`     | `number` | Nombre total d'éléments    | Oui    | -          |
| `pageCount` | `number` | Nombre total de pages      | Oui    | -          |
| `page`      | `number` | Numéro de page actuelle    | Oui    | -          |
| `perPage`   | `number` | Nombre d'éléments par page | Oui    | -          |

## Hook: usePagination

Le composant utilise un hook personnalisé `usePagination` qui peut être utilisé indépendamment :

```tsx
import { usePagination } from "@/sharedts/pagination/hooks";

function MaListe() {
	const {
		page,
		perPage,
		isPending,
		handlePageChange,
		handlePerPageChange,
		getVisibleRange,
	} = usePagination();

	const total = 100; // Exemple
	const { start, end } = getVisibleRange(total);

	return (
		<div>
			<p>
				Affichage des éléments {start} à {end} sur {total}
			</p>

			<button onClick={() => handlePageChange(page + 1)} disabled={isPending}>
				Page suivante
			</button>

			<select
				value={perPage}
				onChange={(e) => handlePerPageChange(Number(e.target.value))}
				disabled={isPending}
			>
				<option value="10">10</option>
				<option value="20">20</option>
				<option value="50">50</option>
			</select>
		</div>
	);
}
```

### Retour du hook

| Propriété             | Type                                                | Description                                                |
| --------------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| `page`                | `number`                                            | La page actuelle extraite des paramètres d'URL             |
| `perPage`             | `number`                                            | Le nombre d'éléments par page extrait des paramètres d'URL |
| `isPending`           | `boolean`                                           | Indique si une transition est en cours                     |
| `handlePageChange`    | `(page: number) => void`                            | Fonction pour changer de page                              |
| `handlePerPageChange` | `(perPage: number) => void`                         | Fonction pour changer le nombre d'éléments par page        |
| `getPageNumbers`      | `(pageCount: number) => number[]`                   | Calcule les numéros de page à afficher                     |
| `getVisibleRange`     | `(total: number) => { start: number; end: number }` | Calcule la plage d'éléments visibles                       |

## Structure des fichiers

```
pagination/
├── components/        # Composants UI
│   ├── index.ts
│   └── pagination.tsx
├── hooks/             # Logique et état
│   └── use-pagination.ts
├── schemas/           # Validation Zod (si applicable)
├── types/             # Types TypeScript (si applicable)
├── utils/             # Fonctions utilitaires
└── index.tsx          # Point d'entrée
```

## Dépendances

- Next.js (useRouter, useSearchParams)
- React (useTransition)
- Lucide React (icônes)
- Radix UI / Shadcn (Button, Select)
