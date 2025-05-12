# UserDropdown

Un composant de menu déroulant élégant pour afficher les informations de l'utilisateur et les actions associées, basé sur Shadcn UI.

## Fonctionnalités

- Affichage des informations utilisateur (nom, email, avatar)
- Menu déroulant personnalisable
- Support des images de profil
- Fallback sur une icône par défaut
- Intégration avec Next.js et React
- Support de la navigation au clavier
- Accessibilité améliorée (labels ARIA)
- Design responsive et moderne
- Skeleton de chargement intégré

## Installation

Le composant est disponible dans le dossier `shared/components/user-dropdown`.

## Utilisation de base

```tsx
import { UserDropdown, UserDropdownSkeleton } from "@/shared/components/user-dropdown";

// Version basique avec une promesse utilisateur
<UserDropdown userPromise={userPromise} />

// Utilisation du skeleton pendant le chargement
<UserDropdownSkeleton />
```

## Props

| Prop          | Type            | Description                                     | Défaut |
| ------------- | --------------- | ----------------------------------------------- | ------ |
| `userPromise` | `Promise<User>` | Promesse contenant les données de l'utilisateur | -      |

## Structure du composant

Le composant affiche :

- Un bouton déclencheur avec :
  - Avatar de l'utilisateur (ou icône par défaut)
  - Nom de l'utilisateur
  - Email de l'utilisateur
  - Icône de menu
- Un menu déroulant contenant :
  - Label "Mon compte"
  - Séparateur
  - Option de déconnexion

### Skeleton

Le composant `UserDropdownSkeleton` reproduit la structure du composant principal avec des éléments de chargement :

- Un placeholder pour l'avatar
- Deux lignes de texte pour le nom et l'email
- Un placeholder pour l'icône de menu

## Accessibilité

- Utilisation des composants Shadcn UI pour une meilleure accessibilité
- Support de la navigation au clavier
- Labels ARIA appropriés
- Contraste suffisant pour la lisibilité

## Personnalisation

Le composant utilise les styles de Shadcn UI et peut être personnalisé via :

- Les classes CSS Tailwind
- Les props de style des composants Shadcn UI
- Les variables CSS personnalisées

## Dépendances

- @/shared/components (Shadcn UI)
- better-auth/types
- lucide-react
- next/image
- next/link
- react
