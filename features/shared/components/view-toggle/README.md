# ToggleView

Un composant permettant de basculer entre différentes vues (grille et liste) dans l'interface utilisateur, avec mise à jour via les URL search params.

## Fonctionnalités

- Bascule entre les vues en grille et en liste
- Persistance du choix via les paramètres d'URL
- Mise à jour optimiste de l'UI pendant les transitions
- Intégration avec le routeur Next.js
- Conçu avec les composants Radix UI (Tabs)

## Installation

Le composant est disponible dans le dossier `shared/components/toggle-view`.

## Utilisation

```tsx
import { ToggleView } from "@/features/shared/components/toggle-view";

export default function MaPage() {
	return (
		<div>
			<ToggleView className="mb-4" />
			{/* Contenu qui change en fonction de la vue sélectionnée */}
		</div>
	);
}
```

## Props

| Prop        | Type     | Description                | Requis | Par défaut  |
| ----------- | -------- | -------------------------- | ------ | ----------- |
| `className` | `string` | Classes CSS additionnelles | Non    | `undefined` |

## Hook: useToggleView

Le composant utilise un hook personnalisé `useToggleView` qui peut être utilisé indépendamment :

```tsx
import { useToggleView } from "@/features/shared/components/toggle-view/hooks";

function MonComposant() {
	const { optimisticView, isPending, handleViewChange } = useToggleView();

	return (
		<>
			<button onClick={() => handleViewChange("grid")} disabled={isPending}>
				Grille
			</button>

			<div>Vue actuelle: {optimisticView}</div>
		</>
	);
}
```

### Retour du hook

| Propriété          | Type                               | Description                                   |
| ------------------ | ---------------------------------- | --------------------------------------------- |
| `currentView`      | `"grid" \| "list"`                 | La vue actuelle extraite des paramètres d'URL |
| `optimisticView`   | `"grid" \| "list"`                 | La vue affichée pendant les transitions       |
| `isPending`        | `boolean`                          | Indique si une transition est en cours        |
| `handleViewChange` | `(view: "grid" \| "list") => void` | Fonction pour changer de vue                  |

## Structure des fichiers

```
toggle-view/
├── components/        # Composants UI
│   ├── index.ts
│   └── toggle-view.tsx
├── hooks/             # Logique et état
│   └── use-toggle-view.ts
├── schemas/           # Validation Zod
│   ├── index.ts
│   └── view-type-schema.ts
├── types/             # Types TypeScript
│   ├── index.ts
│   └── view-type.ts
└── index.tsx          # Point d'entrée
```

## Dépendances

- Next.js
- React (hooks: useOptimistic, useTransition)
- Lucide React (icônes)
- Radix UI / Shadcn (composant Tabs)
- Zod (validation)
