# Loader Fullscreen

Un composant de chargement plein écran avec animations fluides pour indiquer les états de chargement de l'application. Utilise framer-motion pour des animations riches et personnalisables.

## Fonctionnalités

- Animation d'entrée/sortie élaborée avec framer-motion
- Overlay semi-transparent avec effet de flou configurable
- Bouton de fermeture optionnel
- Indicateur de progression animé
- Design accessible
- Options de personnalisation poussées

## Installation

Le composant est disponible dans le dossier `shared/components/loader-fullscreen`.

## Utilisation

```tsx
import { LoaderFullscreen } from "@/shared/components/loader-fullscreen";

// Loader plein écran basique
<LoaderFullscreen />

// Avec texte et options
<LoaderFullscreen
  text="Chargement des données..."
  variant="dots"
  size="lg"
  color="primary"
  overlayColor="rgba(0, 0, 0, 0.8)"
  blurStrength={10}
/>

// Avec bouton de fermeture
<LoaderFullscreen
  text="Chargement terminé"
  showCloseButton
  onClose={() => setIsLoading(false)}
/>

// Sans barre de progression
<LoaderFullscreen
  text="Veuillez patienter..."
  showProgressBar={false}
/>
```

### Utilisation via le composant Loader

Le composant est également disponible via `Loader.Fullscreen` pour compatibilité avec l'existant :

```tsx
import { Loader } from "@/shared/components/loader";

<Loader.Fullscreen text="Chargement en cours..." color="secondary" />;
```

## Props

| Prop                 | Type            | Description                           | Requis | Par défaut                 |
| -------------------- | --------------- | ------------------------------------- | ------ | -------------------------- |
| `variant`            | `LoaderVariant` | Style visuel du loader                | Non    | `"spinner"`                |
| `size`               | `LoaderSize`    | Taille du loader                      | Non    | `"lg"`                     |
| `text`               | `string`        | Texte à afficher                      | Non    | `undefined`                |
| `color`              | `LoaderColor`   | Couleur du loader                     | Non    | `"primary"`                |
| `overlayColor`       | `string`        | Couleur CSS de l'overlay              | Non    | `rgba(255, 255, 255, 0.9)` |
| `zIndex`             | `number`        | z-index de l'overlay                  | Non    | `50`                       |
| `showCloseButton`    | `boolean`       | Afficher un bouton de fermeture       | Non    | `false`                    |
| `onClose`            | `() => void`    | Fonction appelée lors de la fermeture | Non    | `undefined`                |
| `className`          | `string`        | Classes CSS additionnelles            | Non    | `undefined`                |
| `transitionDuration` | `number`        | Durée de la transition en secondes    | Non    | `0.4`                      |
| `blurStrength`       | `number`        | Intensité du flou d'arrière-plan      | Non    | `5`                        |
| `showProgressBar`    | `boolean`       | Afficher la barre de progression      | Non    | `true`                     |

## Animations personnalisées

Le composant utilise des animations framer-motion élaborées pour offrir une expérience fluide et agréable :

- **Overlay** : Apparition progressive avec effet de flou
- **Contenu** : Animation d'échelle et de position
- **Bouton de fermeture** : Rotation et transition d'échelle
- **Barre de progression** : Animation d'opacité et de progression

## Structure des fichiers

```
loader-fullscreen/
├── components/       # Composants UI
│   ├── index.ts
│   └── loader-fullscreen.tsx
├── constants/        # Constantes et animations
│   └── index.ts
├── types/            # Types TypeScript
│   └── index.ts
└── index.ts          # Point d'entrée
```

## Dépendances

- React
- Tailwind CSS
- clsx/cn (pour la gestion conditionnelle des classes)
- framer-motion (pour les animations)
- lucide-react (pour les icônes)
