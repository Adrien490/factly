# Logo

Un composant personnalisable pour afficher le logo et la marque de l'application avec de nombreuses options de présentation.

## Fonctionnalités

- Plusieurs variantes visuelles (default, accent, dark, light, modern, minimal, gradient)
- Tailles configurables (xs, sm, md, lg, xl)
- Formes personnalisables (square, softSquare, circle, card)
- Animations et effets (glow, hover, animation)
- Badge numérique pour notifications
- Accessibilité améliorée (labels ARIA, navigation au clavier)
- Support pour les icônes personnalisées

## Installation

Le composant est disponible dans le dossier `shared/components/logo`.

## Utilisation de base

```tsx
import { Logo } from "@/shared/components/logo";

// Version basique
<Logo />

// Avec texte visible
<Logo hideText={false} text="Factly" />

// Variant et taille spécifiques
<Logo variant="gradient" size="lg" hideText={false} />

// Version interactive (pour les liens/boutons)
<Logo interactive hover={true} />
```

## Exemples avancés

```tsx
// Avec badge de notification
<Logo badge="3" badgeColor="danger" />

// Logo personnalisé
<Logo
  customIcon={<CustomSvgIcon />}
  hideText={false}
  textPosition="bottom"
/>

// Accessibilité améliorée
<Logo
  srText="Retour à l'accueil Factly"
  interactive
  hideText={false}
/>

// Animation spéciale
<Logo
  animate={true}
  glow={true}
  hover={true}
  variant="gradient"
/>
```

## Props

| Prop           | Type                                     | Description                         | Défaut    |
| -------------- | ---------------------------------------- | ----------------------------------- | --------- |
| `variant`      | `string`                                 | Style visuel du logo                | `default` |
| `size`         | `xs \| sm \| md \| lg \| xl`             | Taille du logo                      | -         |
| `shape`        | `square \| softSquare \| circle \| card` | Forme du conteneur                  | -         |
| `hideText`     | `boolean`                                | Masque le texte à côté du logo      | `true`    |
| `text`         | `string`                                 | Texte à afficher                    | `Factly`  |
| `textSize`     | `xs \| sm \| md \| lg \| xl`             | Taille du texte                     | `md`      |
| `textPosition` | `right \| left \| bottom`                | Position du texte                   | `right`   |
| `glow`         | `boolean`                                | Effet de halo lumineux              | -         |
| `hover`        | `boolean`                                | Effet au survol                     | -         |
| `interactive`  | `boolean`                                | Rend le logo interactif (focusable) | -         |
| `badge`        | `string`                                 | Texte du badge                      | -         |
| `badgeColor`   | `string`                                 | Couleur du badge                    | `primary` |
| `animate`      | `boolean`                                | Animation à l'apparition            | `false`   |
| `withBorder`   | `boolean`                                | Affiche une bordure                 | `true`    |
| `srText`       | `string`                                 | Texte pour lecteurs d'écran         | -         |
| `customIcon`   | `ReactNode`                              | Icône personnalisée                 | -         |
| `className`    | `string`                                 | Classes CSS additionnelles          | -         |
