# Loader

Un composant de chargement versatile supportant plusieurs variantes visuelles, tailles et alignements pour indiquer les états de chargement dans l'application. Utilise framer-motion pour des animations fluides et une expérience utilisateur moderne.

## Fonctionnalités

- Plusieurs variantes visuelles: spinner, dots, pulse
- Animations fluides avec framer-motion
- Différentes tailles disponibles (xs, sm, md, lg, xl)
- Texte de chargement personnalisable
- Options d'alignement et de positionnement
- Support pour la coloration via thème ou props
- Version plein écran avec overlay et effet de flou
- Option pour afficher un bouton de fermeture sur la version plein écran
- Composant de bouton avec état de chargement intégré
- Design accessible avec aria-live pour les lecteurs d'écran

## Installation

Le composant est disponible dans le dossier `shared/components/loader`.

## Utilisation

```tsx
import { Loader } from "@/features/shared/components/loader";

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

// Loader plein écran avec bouton de fermeture
<Loader.Fullscreen
  text="Chargement terminé"
  showCloseButton
  onClose={() => setIsLoading(false)}
/>

// Bouton avec état de chargement
<Loader.Button
  loading={isLoading}
  onClick={handleSubmit}
  className="bg-primary text-white px-4 py-2 rounded-md"
>
  Soumettre
</Loader.Button>
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

| Prop        | Type                                                                                                                                 | Description                | Requis | Par défaut  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- | ------ | ----------- |
| `variant`   | `"spinner" \| "dots" \| "pulse"`                                                                                                     | Style visuel du loader     | Non    | `"spinner"` |
| `size`      | `"xs" \| "sm" \| "md" \| "lg" \| "xl"`                                                                                               | Taille du loader           | Non    | `"md"`      |
| `text`      | `string`                                                                                                                             | Texte à afficher           | Non    | `undefined` |
| `align`     | `"start" \| "center" \| "end"`                                                                                                       | Alignement horizontal      | Non    | `"center"`  |
| `color`     | `"default" \| "primary" \| "secondary" \| "foreground" \| "muted" \| "accent" \| "success" \| "warning" \| "destructive" \| "white"` | Couleur du loader          | Non    | `"primary"` |
| `className` | `string`                                                                                                                             | Classes CSS additionnelles | Non    | `undefined` |

### Props spécifiques pour Loader.Fullscreen

| Prop              | Type         | Description                           | Requis | Par défaut                 |
| ----------------- | ------------ | ------------------------------------- | ------ | -------------------------- |
| `overlayColor`    | `string`     | Couleur CSS de l'overlay              | Non    | `rgba(255, 255, 255, 0.9)` |
| `zIndex`          | `number`     | z-index de l'overlay                  | Non    | `50`                       |
| `showCloseButton` | `boolean`    | Afficher un bouton de fermeture       | Non    | `false`                    |
| `onClose`         | `() => void` | Fonction appelée lors de la fermeture | Non    | `undefined`                |

### Props spécifiques pour Loader.Button

| Prop          | Type            | Description                  | Requis | Par défaut  |
| ------------- | --------------- | ---------------------------- | ------ | ----------- |
| `loading`     | `boolean`       | État de chargement du bouton | Non    | `false`     |
| `loaderSize`  | `LoaderSize`    | Taille du loader             | Non    | `"sm"`      |
| `loaderColor` | `LoaderColor`   | Couleur du loader            | Non    | `"white"`   |
| `variant`     | `LoaderVariant` | Style visuel du loader       | Non    | `"spinner"` |

## Utilisation avancée avec contexte de chargement

Le composant peut être utilisé avec un contexte de chargement pour gérer les états de chargement à l'échelle de l'application.

```tsx
import { useLoadingContext } from "@/features/shared/contexts/loading-context";

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

			{isLoading && <Loader.Fullscreen />}
		</div>
	);
}
```

## Animations avec framer-motion

Le composant utilise framer-motion pour des animations fluides et personnalisables :

- **Spinner** : Rotation continue
- **Dots** : Animation de rebond avec délai entre chaque point
- **Pulse** : Effet de pulsation avec changement d'échelle et d'opacité

## Structure des fichiers

```
loader/
├── components/        # Composants UI
│   ├── index.ts
│   ├── loader.tsx     # Composant principal avec sous-composants
├── constants/         # Constantes et utilitaires
│   └── index.ts       # Classes et animations
├── types/             # Types TypeScript
│   └── index.ts       # Définition des types pour les props
└── index.ts           # Point d'entrée
```

## Dépendances

- React
- Tailwind CSS (pour les styles)
- clsx/cn (pour la gestion conditionnelle des classes)
- framer-motion (pour les animations)
- lucide-react (pour les icônes)
