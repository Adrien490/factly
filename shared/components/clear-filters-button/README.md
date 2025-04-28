# ClearFiltersButton

Un composant simple et efficace pour supprimer plusieurs filtres d'URL en un seul clic.

## Fonctionnalités

- Supprime un ou plusieurs filtres spécifiés
- Apparaît seulement lorsqu'au moins un filtre est actif
- Réinitialise automatiquement la pagination à la page 1
- Affiche un état de chargement pendant la transition
- Personnalisable via les props

## Installation

Le composant est disponible dans le dossier `shared/components/clear-filters-button`.

## Utilisation de base

```tsx
import { ClearFiltersButton } from "@/shared/components/clear-filters-button";

// Version basique - supprime les filtres "status" et "type"
<ClearFiltersButton filters={["status", "type"]} />

// Avec texte personnalisé
<ClearFiltersButton
  filters={["status", "type"]}
  label="Réinitialiser les filtres"
/>

// Avec préfixe pour les noms de filtres
<ClearFiltersButton
  filters={["status", "type"]}
  prefix="filter_"
/>

// Avec callback de notification
<ClearFiltersButton
  filters={["status", "type"]}
  onClear={() => console.log("Filtres supprimés")}
/>
```

## Exemples d'intégration

```tsx
// Dans une barre d'outils
<Toolbar
  leftContent={<SearchForm />}
  rightContent={
    <>
      <Filters />
      <ClearFiltersButton filters={["status", "category", "date"]} />
    </>
  }
/>

// Dans un panneau de filtres
<FilterSheet>
  <SheetHeader>Filtres</SheetHeader>
  <FilterContent>
    {/* Contenu des filtres */}
  </FilterContent>
  <SheetFooter>
    <ClearFiltersButton
      filters={["status", "category", "date"]}
      className="w-full"
    />
  </SheetFooter>
</FilterSheet>
```

## Props

| Prop             | Type                   | Description                                       | Défaut                |
| ---------------- | ---------------------- | ------------------------------------------------- | --------------------- |
| `filters`        | `string[]`             | Liste des noms de filtres à supprimer             | -                     |
| `label`          | `string`               | Texte affiché sur le bouton                       | `Effacer les filtres` |
| `prefix`         | `string`               | Préfixe pour les noms de filtres dans l'URL       | `""`                  |
| `onClear`        | `() => void`           | Fonction appelée après la suppression des filtres | -                     |
| `className`      | `string`               | Classes CSS additionnelles                        | -                     |
| `...buttonProps` | `ButtonHTMLAttributes` | Autres propriétés de bouton HTML                  | -                     |

## Comportements spécifiques

- Le bouton n'est pas rendu si aucun des filtres spécifiés n'est actif
- Lors du clic, tous les filtres spécifiés sont supprimés et la pagination est réinitialisée
- Le bouton est désactivé pendant la transition de navigation
