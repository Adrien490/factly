# DateRangeFilter

`DateRangeFilter` est un composant qui permet à l'utilisateur de filtrer des données par plage de dates. Il utilise une interface utilisateur intuitive avec un calendrier pour sélectionner les dates de début et de fin.

## Fonctionnalités

- Sélection d'une plage de dates à l'aide d'un calendrier double
- Synchronisation avec les paramètres d'URL pour la persistance des filtres
- Boutons de sélection rapide (Aujourd'hui, 7 derniers jours)
- Affichage formaté de la plage de dates sélectionnée
- Indicateur de chargement pendant les mises à jour
- Possibilité de définir des limites de dates (min/max)

## Installation

```tsx
import {
	DateRangeFilter,
	useDateRangeFilter,
} from "@/features/shared/components/date-range-filter";
```

## Utilisation

### Exemple basique

```tsx
import { DateRangeFilter } from "@/features/shared/components/date-range-filter";

export default function FilterComponent() {
	return (
		<div>
			<DateRangeFilter filterKey="creation_date" label="Date de création" />
		</div>
	);
}
```

### Avec limites de dates et personnalisation

```tsx
import { DateRangeFilter } from "@/features/shared/components/date-range-filter";

export default function FilterComponent() {
	const minDate = new Date(2020, 0, 1); // 1er janvier 2020
	const maxDate = new Date(); // Aujourd'hui

	return (
		<div>
			<DateRangeFilter
				filterKey="delivery_date"
				label="Date de livraison"
				placeholder="Choisir une période de livraison"
				format="dd MMMM yyyy"
				minDate={minDate}
				maxDate={maxDate}
				onDateRangeChange={(range) => {
					console.log("Nouvelle période sélectionnée:", range);
				}}
			/>
		</div>
	);
}
```

### Utilisation avec le hook personnalisé

```tsx
import { useDateRangeFilter } from "@/features/shared/components/date-range-filter";

export function MyComponent() {
	const {
		dateRange,
		setDateRange,
		setFromDate,
		setToDate,
		clearDateRange,
		isPending,
	} = useDateRangeFilter("event_date");

	// Accès direct à la plage de dates actuelle
	console.log("Date de début:", dateRange.from);
	console.log("Date de fin:", dateRange.to);

	return (
		<div>
			{/* Interface utilisateur personnalisée utilisant les fonctions du hook */}
		</div>
	);
}
```

## Props

| Prop                | Type                         | Requis | Par défaut                 | Description                                                                         |
| ------------------- | ---------------------------- | ------ | -------------------------- | ----------------------------------------------------------------------------------- |
| `filterKey`         | `string`                     | ✅     | -                          | Clé unique pour identifier ce filtre dans l'URL (sera préfixé par 'from*' et 'to*') |
| `label`             | `string`                     | ✅     | -                          | Label affiché avant le sélecteur de dates                                           |
| `placeholder`       | `string`                     | ❌     | "Sélectionner une période" | Texte affiché quand aucune date n'est sélectionnée                                  |
| `format`            | `string`                     | ❌     | "dd/MM/yyyy"               | Format d'affichage des dates                                                        |
| `minDate`           | `Date`                       | ❌     | -                          | Date minimale sélectionnable                                                        |
| `maxDate`           | `Date`                       | ❌     | -                          | Date maximale sélectionnable                                                        |
| `className`         | `string`                     | ❌     | -                          | Classes CSS additionnelles                                                          |
| `onDateRangeChange` | `(range: DateRange) => void` | ❌     | -                          | Fonction appelée lorsque la plage de dates change                                   |

## Hook: useDateRangeFilter

Le hook `useDateRangeFilter` est utilisé pour gérer l'état et les interactions avec les paramètres d'URL pour le filtre de plage de dates.

### Retourne

| Propriété        | Type                                           | Description                                                |
| ---------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| `dateRange`      | `{ from: string \| null, to: string \| null }` | La plage de dates actuelle                                 |
| `setDateRange`   | `(range: DateRange) => void`                   | Fonction pour définir une nouvelle plage de dates complète |
| `setFromDate`    | `(from: DateValue) => void`                    | Fonction pour mettre à jour uniquement la date de début    |
| `setToDate`      | `(to: DateValue) => void`                      | Fonction pour mettre à jour uniquement la date de fin      |
| `clearDateRange` | `() => void`                                   | Fonction pour effacer la plage de dates                    |
| `isPending`      | `boolean`                                      | Indique si une mise à jour est en cours                    |

## Structure des fichiers

```
date-range-filter/
├── components/
│   └── date-range-filter.tsx     # Composant principal
├── hooks/
│   └── use-date-range-filter.ts  # Hook pour gérer l'état et les paramètres d'URL
├── types/
│   └── index.ts                  # Types et interfaces
├── index.ts                      # Exports publics
└── README.md                     # Documentation
```

## Dépendances

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [date-fns](https://date-fns.org/) - Pour le formatage et la manipulation des dates
- [react-day-picker](https://react-day-picker.js.org/) - Pour le composant de calendrier
- [Lucide React](https://lucide.dev/) - Pour les icônes
- Composants UI personnalisés (Button, Popover, etc.)
