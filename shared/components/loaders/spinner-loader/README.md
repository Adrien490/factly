# SpinnerLoader

Ce composant affiche un indicateur de chargement rotatif basé sur l'icône `Loader2` de Lucide.

## Utilisation

```tsx
import { SpinnerLoader } from "@/shared/components/spinner-loader";

export default function Example() {
	return (
		<div>
			<SpinnerLoader />
			<SpinnerLoader size="md" color="primary" />
			<SpinnerLoader size="lg" color="destructive" />
		</div>
	);
}
```

## Props

| Nom       | Type               | Par défaut | Description                       |
| --------- | ------------------ | ---------- | --------------------------------- |
| size      | SpinnerLoaderSize  | "sm"       | Taille du spinner                 |
| color     | SpinnerLoaderColor | "primary"  | Couleur du spinner                |
| className | string             | -          | Classes supplémentaires à ajouter |

### Types

```tsx
type SpinnerLoaderSize = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerLoaderColor =
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

Le loader utilise Framer Motion pour créer une rotation continue à 360 degrés avec une durée de 1 seconde et une répétition infinie.

## Styles

Les styles sont basés sur les classes Tailwind et sont configurés pour s'adapter aux différentes tailles définies dans les constantes.
