# Radio Group Item Filter

Un composant de bouton radio qui met à jour l'URL avec une valeur de filtre unique, idéal pour les filtres à sélection exclusive avec une expérience utilisateur optimiste.

## Fonctionnalités

- Met automatiquement à jour l'URL avec le paramètre de filtrage
- État optimiste pour une UX fluide sans attendre les réponses du serveur
- Support pour la désélection (cliquer sur un bouton radio déjà sélectionné le désélectionne)
- Compatible avec les layouts React Server Components
- Indicateur visuel pendant les transitions d'état
- Génération automatique des IDs (ou possibilité de les personnaliser)
- S'intègre avec le composant `RadioGroup` de la librairie UI

## Installation

Le composant est disponible dans le dossier `shared/components/radio-group-item-filter`.

## Utilisation de base

```tsx
import { RadioGroup } from "@/shared/components/ui/radio-group";
import { RadioGroupItemFilter } from "@/shared/components/radio-group-item-filter";

// Utilisation simple
<RadioGroup>
  <RadioGroupItemFilter
    filterKey="type"
    value="client"
    id="type-client"
  />
</RadioGroup>

// Avec un label ajouté à côté
<RadioGroup>
  <div className="flex items-center space-x-2">
    <RadioGroupItemFilter
      filterKey="type"
      value="client"
    />
    <Label htmlFor="type-client">Client</Label>
  </div>
</RadioGroup>
```

## Exemples avancés

```tsx
// Filtres multiples avec options
<RadioGroup>
  <div className="space-y-2">
    {types.map((type) => (
      <div className="flex items-center space-x-2" key={type.value}>
        <RadioGroupItemFilter
          filterKey="type"
          value={type.value}
          id={`type-${type.value}`}
        />
        <Label htmlFor={`type-${type.value}`} className="flex items-center">
          <span
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: type.color }}
          />
          {type.label}
        </Label>
      </div>
    ))}
  </div>
</RadioGroup>

// Avec classe personnalisée
<RadioGroupItemFilter
  filterKey="category"
  value="premium"
  className="h-5 w-5 data-[state=checked]:bg-blue-500"
/>
```

## Props

| Prop        | Type     | Description                          | Défaut                  |
| ----------- | -------- | ------------------------------------ | ----------------------- |
| `filterKey` | `string` | Clé du paramètre utilisée dans l'URL | **Requis**              |
| `value`     | `string` | Valeur du filtre à définir           | **Requis**              |
| `id`        | `string` | ID HTML du bouton radio              | `${filterKey}-${value}` |
| `className` | `string` | Classes CSS additionnelles           | -                       |

## Fonctionnement interne

Le composant utilise le hook `useFilter` pour gérer l'état des filtres dans l'URL. Quand un bouton radio est sélectionné:

1. Le hook `setFilter` définit la valeur dans l'URL
2. Si le bouton est déjà sélectionné, il est désélectionné
3. La pagination est réinitialisée à la page 1
4. L'état optimiste est mis à jour immédiatement pour une UX fluide
5. L'URL est mise à jour via `next/navigation` sans rechargement de page

## Différence avec CheckboxFilter

Contrairement au `CheckboxFilter` qui permet de sélectionner plusieurs valeurs, le `RadioGroupItemFilter` ne permet qu'une seule valeur active à la fois pour une clé de filtre donnée, conformément au comportement standard des boutons radio.

## Hook associé

Ce composant utilise le hook `useFilter` qui peut être utilisé directement pour des cas plus complexes:

```tsx
const { values, setFilter, isSelected, isPending } = useFilter("category");
const currentValue = values[0] || ""; // Pour les filtres à sélection unique
```
