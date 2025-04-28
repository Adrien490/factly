# Checkbox Filter

Un composant de case à cocher qui met à jour l'URL avec des filtres, fournissant une expérience utilisateur optimiste pour le filtrage de données.

## Fonctionnalités

- Met automatiquement à jour l'URL avec les paramètres de filtrage
- État optimiste pour une UX fluide sans attendre les réponses du serveur
- Support pour les filtres à valeurs multiples (sélection de plusieurs valeurs)
- Compatible avec les layouts React Server Components
- Indicateur visuel pendant les transitions d'état
- Généreation automatique des IDs (ou possibilité de les personnaliser)

## Installation

Le composant est disponible dans le dossier `shared/components/checkbox-filter`.

## Utilisation de base

```tsx
import { CheckboxFilter } from "@/shared/components/checkbox-filter";

// Utilisation simple
<CheckboxFilter
  filterKey="status"
  value="active"
  id="status-active"
/>

// Avec un label ajouté à côté
<div className="flex items-center space-x-2">
  <CheckboxFilter
    filterKey="status"
    value="active"
  />
  <Label htmlFor="status-active">Actif</Label>
</div>
```

## Exemples avancés

```tsx
// Filtres multiples
<div className="space-y-2">
  {statuses.map((status) => (
    <div className="flex items-center space-x-2" key={status.value}>
      <CheckboxFilter
        filterKey="status"
        value={status.value}
        id={`status-${status.value}`}
      />
      <Label htmlFor={`status-${status.value}`} className="flex items-center">
        <span
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: status.color }}
        />
        {status.label}
      </Label>
    </div>
  ))}
</div>

// Avec classe personnalisée
<CheckboxFilter
  filterKey="feature"
  value="premium"
  className="h-5 w-5"
/>
```

## Props

| Prop        | Type     | Description                          | Défaut                  |
| ----------- | -------- | ------------------------------------ | ----------------------- |
| `filterKey` | `string` | Clé du paramètre utilisée dans l'URL | **Requis**              |
| `value`     | `string` | Valeur du filtre à ajouter/supprimer | **Requis**              |
| `id`        | `string` | ID HTML de la checkbox               | `${filterKey}-${value}` |
| `className` | `string` | Classes CSS additionnelles           | -                       |

## Fonctionnement interne

Le composant utilise le hook `useFilter` pour gérer l'état des filtres dans l'URL. Quand une checkbox est cochée/décochée:

1. Le hook `toggleFilter` ajoute ou retire la valeur de l'URL
2. La pagination est réinitialisée à la page 1
3. L'état optimiste est mis à jour immédiatement pour une UX fluide
4. L'URL est mise à jour via `next/navigation` sans rechargement de page

## Hook associé

Ce composant utilise le hook `useFilter` qui peut être utilisé directement pour des cas plus complexes:

```tsx
const { values, toggleFilter, isSelected, isPending } = useFilter("category");
```
