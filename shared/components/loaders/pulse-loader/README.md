# PulseLoader

Ce composant affiche un indicateur de chargement pulsant, avec un point central fixe et un cercle qui pulse autour.

## Utilisation

```tsx
import { PulseLoader } from "@/shared/components/pulse-loader";

export default function Example() {
	return (
		<div>
			<PulseLoader />
			<PulseLoader size="md" color="primary" />
			<PulseLoader size="lg" color="destructive" />
		</div>
	);
}
```

## Props

| Nom       | Type             | Par défaut | Description                       |
| --------- | ---------------- | ---------- | --------------------------------- |
| size      | PulseLoaderSize  | "sm"       | Taille du cercle pulsant          |
| color     | PulseLoaderColor | "primary"  | Couleur du cercle                 |
| className | string           | -          | Classes supplémentaires à ajouter |

### Types

```tsx
type PulseLoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
type PulseLoaderColor =
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

Le loader utilise Framer Motion pour créer un effet de pulsation :

1. Animation de scale (de 0.8 à 1.2 puis retour à 0.8)
2. Animation d'opacité (de 0.5 à 1 puis retour à 0.5)

Cette animation a une durée de 1.5 seconde par cycle et se répète à l'infini avec une transition fluide (easeInOut).

## Styles

Le composant se compose de deux éléments :

1. Un cercle extérieur (transparent) qui pulse avec l'animation
2. Un point central fixe qui reste à taille constante

Les deux éléments sont parfaitement centrés (`flex items-center justify-center`) et utilisent des classes Tailwind pour leur style.
