# DotsLoader

Ce composant affiche un indicateur de chargement basé sur trois points qui rebondissent verticalement.

## Utilisation

```tsx
import { DotsLoader } from "@/shared/components/dots-loader";

export default function Example() {
	return (
		<div>
			<DotsLoader />
			<DotsLoader size="md" color="primary" />
			<DotsLoader size="lg" color="destructive" />
		</div>
	);
}
```

## Props

| Nom       | Type            | Par défaut | Description                       |
| --------- | --------------- | ---------- | --------------------------------- |
| size      | DotsLoaderSize  | "sm"       | Taille des points                 |
| color     | DotsLoaderColor | "primary"  | Couleur des points                |
| className | string          | -          | Classes supplémentaires à ajouter |

### Types

```tsx
type DotsLoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
type DotsLoaderColor =
	| "default"
	| "primary"
	| "secondary"
	| "foreground"
	| "muted"
	| "accent"
	| "success"
	| "warning"
	| "destructive"
	| "white";
```

## Animation

Le loader utilise Framer Motion pour créer :

1. Un effet staggered sur les points (délai de 0.15s entre chaque point)
2. Une animation verticale sur chaque point (de 0 à -10px puis retour à 0)
3. Une animation d'opacité (de 0.5 à 1 puis retour à 0.5)

Cette animation a une durée de 0.8 seconde par cycle et se répète à l'infini.

## Styles

Les styles sont basés sur les classes Tailwind. Les points sont circulaires (`rounded-full`) et leurs dimensions sont configurées selon la taille spécifiée dans les constantes.
