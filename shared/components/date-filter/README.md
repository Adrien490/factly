# DateFilter

`DateFilter` est un composant qui permet à l'utilisateur de filtrer des données par une date spécifique. Il utilise une interface utilisateur intuitive avec un calendrier pour sélectionner une date.

## Fonctionnalités

- Sélection d'une date unique à l'aide d'un calendrier
- Synchronisation avec les paramètres d'URL pour la persistance des filtres
- Bouton de sélection rapide (Aujourd'hui)
- Affichage formaté de la date sélectionnée
- Indicateur de chargement pendant les mises à jour
- Possibilité de définir des limites de dates (min/max)

## Installation

```tsx
import { DateFilter, useDateFilter } from "@/shared/components/date-filter";
```

## Utilisation

### Exemple basique

```tsx
import { DateFilter } from "@/sharedts/date-filter";

export default function FilterComponent() {
	return (
		<div>
			<DateFilter filterKey="created_at" label="Date de création" />
		</div>
	);
}
```

### Avec limites de dates et personnalisation

```tsx
import { DateFilter } from "@/sharedts/date-filter";

export default function FilterComponent() {
	const minDate = new Date(2020, 0, 1); // 1er janvier 2020
	const maxDate = new Date(); // Aujourd'hui

	return (
		<div>
			<DateFilter
				filterKey="published_at"
				label="Date de publication"
				placeholder="Choisir une date de publication"
				format="dd MMMM yyyy"
				minDate={minDate}
				maxDate={maxDate}
				onDateChange={(date) => {
					console.log("Nouvelle date sélectionnée:", date);
				}}
			/>
		</div>
	);
}
```

### Utilisation avec le hook personnalisé

```tsx
import { useDateFilter } from "@/sharedts/date-filter";

export function MyComponent() {
	const { date, setDate, clearDate, isPending } = useDateFilter("event_date");

	// Accès direct à la date actuelle
	console.log("Date sélectionnée:", date);

	return (
		<div>
			{/* Interface utilisateur personnalisée utilisant les fonctions du hook */}
		</div>
	);
}
```

## Props

| Prop           | Type                        | Requis | Par défaut              | Description                                        |
| -------------- | --------------------------- | ------ | ----------------------- | -------------------------------------------------- |
| `filterKey`    | `string`                    | ✅     | -                       | Clé unique pour identifier ce filtre dans l'URL    |
| `label`        | `string`                    | ✅     | -                       | Label affiché avant le sélecteur de date           |
| `placeholder`  | `string`                    | ❌     | "Sélectionner une date" | Texte affiché quand aucune date n'est sélectionnée |
| `format`       | `string`                    | ❌     | "dd/MM/yyyy"            | Format d'affichage de la date                      |
| `minDate`      | `Date`                      | ❌     | -                       | Date minimale sélectionnable                       |
| `maxDate`      | `Date`                      | ❌     | -                       | Date maximale sélectionnable                       |
| `className`    | `string`                    | ❌     | -                       | Classes CSS additionnelles                         |
| `onDateChange` | `(date: DateValue) => void` | ❌     | -                       | Fonction appelée lorsque la date change            |

## Hook: useDateFilter

Le hook `useDateFilter` est utilisé pour gérer l'état et les interactions avec les paramètres d'URL pour le filtre de date unique.

### Retourne

| Propriété   | Type                        | Description                                              |
| ----------- | --------------------------- | -------------------------------------------------------- |
| `date`      | `string \| null`            | La date actuellement sélectionnée (au format ISO string) |
| `setDate`   | `(date: DateValue) => void` | Fonction pour définir une nouvelle date                  |
| `clearDate` | `() => void`                | Fonction pour effacer la date                            |
| `isPending` | `boolean`                   | Indique si une mise à jour est en cours                  |

## Structure des fichiers

```
date-filter/
├── components/
│   └── date-filter.tsx     # Composant principal
├── hooks/
│   └── use-date-filter.ts  # Hook pour gérer l'état et les paramètres d'URL
├── types/
│   └── index.ts            # Types et interfaces
├── index.ts                # Exports publics
└── README.md               # Documentation
```

## Dépendances

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [date-fns](https://date-fns.org/) - Pour le formatage et la manipulation des dates
- [react-day-picker](https://react-day-picker.js.org/) - Pour le composant de calendrier
- [Lucide React](https://lucide.dev/) - Pour les icônes
- Composants UI personnalisés (Button, Popover, etc.)
