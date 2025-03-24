# Loader

Un composant de chargement versatile supportant plusieurs variantes visuelles, tailles et alignements pour indiquer les états de chargement dans l'application.

## Fonctionnalités

- Plusieurs variantes visuelles: spinner, dots, pulse
- Différentes tailles disponibles
- Texte de chargement personnalisable
- Options d'alignement et de positionnement
- Support pour la coloration via thème ou props
- Version plein écran avec overlay
- Design accessible avec aria-live pour les lecteurs d'écran

## Installation

Le composant est disponible dans le dossier `shared/components/loader`.

## Utilisation

```tsx
import { Loader } from "@/shared/components/loader";

// Loader simple
<Loader />

// Avec texte et options
<Loader
  text="Chargement des données..."
  variant="dots"
  size="lg"
  align="center"
  color="primary"
/>

// Loader plein écran avec overlay
<Loader.Fullscreen text="Veuillez patienter..." />
```

### Utilisation dans un conteneur

```tsx
function DataTable() {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<div className="relative min-h-[200px]">
			{isLoading && (
				<Loader
					variant="spinner"
					text="Chargement du tableau..."
					className="absolute inset-0"
				/>
			)}

			{/* Contenu du tableau */}
		</div>
	);
}
```

## Props

| Prop        | Type                                                  | Description                | Requis | Par défaut  |
| ----------- | ----------------------------------------------------- | -------------------------- | ------ | ----------- |
| `variant`   | `"spinner" \| "dots" \| "pulse"`                      | Style visuel du loader     | Non    | `"spinner"` |
| `size`      | `"xs" \| "sm" \| "md" \| "lg" \| "xl"`                | Taille du loader           | Non    | `"md"`      |
| `text`      | `string`                                              | Texte à afficher           | Non    | `undefined` |
| `align`     | `"start" \| "center" \| "end"`                        | Alignement horizontal      | Non    | `"center"`  |
| `color`     | `"primary" \| "secondary" \| "foreground" \| "muted"` | Couleur du loader          | Non    | `"primary"` |
| `className` | `string`                                              | Classes CSS additionnelles | Non    | `undefined` |

### Props spécifiques pour Loader.Fullscreen

| Prop           | Type     | Description              | Requis | Par défaut           |
| -------------- | -------- | ------------------------ | ------ | -------------------- |
| `overlayColor` | `string` | Couleur CSS de l'overlay | Non    | `rgba(0, 0, 0, 0.5)` |
| `zIndex`       | `number` | z-index de l'overlay     | Non    | `50`                 |

## Utilisation avancée avec contexte de chargement

Le composant peut être utilisé avec un contexte de chargement pour gérer les états de chargement à l'échelle de l'application.

```tsx
import { useLoadingContext } from "@/shared/contexts/loading-context";

function MonComposant() {
	const { isLoading, startLoading, stopLoading } = useLoadingContext();

	const fetchData = async () => {
		startLoading("Chargement des données...");
		try {
			// Appel API ou autre opération asynchrone
			await api.getData();
		} finally {
			stopLoading();
		}
	};

	return (
		<div>
			<button onClick={fetchData} disabled={isLoading}>
				Charger les données
			</button>

			{isLoading && <Loader />}
		</div>
	);
}
```

## Structure des fichiers

```
loader/
├── components/        # Composants UI
│   ├── index.ts
│   ├── loader.tsx
│   ├── loader-dots.tsx
│   ├── loader-spinner.tsx
│   ├── loader-pulse.tsx
│   └── loader-fullscreen.tsx
├── types/             # Types TypeScript
│   └── index.ts       # Définition des types pour les props
└── index.tsx          # Point d'entrée
```

## Dépendances

- React
- Tailwind CSS (pour les styles)
- clsx/cn (pour la gestion conditionnelle des classes)
