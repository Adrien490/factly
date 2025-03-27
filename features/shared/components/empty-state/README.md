# EmptyState

Un composant simple et animé pour afficher des états vides, avec des animations fluides.

## Fonctionnalités

- Animations fluides avec framer-motion
- Support pour les icônes et illustrations personnalisées
- Interface simple et facile à utiliser
- Conception responsive

## Installation

Le composant est disponible dans le dossier `shared/components/empty-state`.

## Utilisation de base

```tsx
import { EmptyState } from "@/features/shared/components/empty-state";
import { Search } from "lucide-react";

// Version simple
<EmptyState
  icon={Search}
  title="Aucun résultat trouvé"
  description="Essayez de modifier vos critères de recherche."
/>

// Avec action
<EmptyState
  icon={Search}
  title="Aucun résultat trouvé"
  description="Essayez de modifier vos critères de recherche."
  action={<Button>Réinitialiser la recherche</Button>}
/>
```

## Illustrations personnalisées

```tsx
import Image from "next/image";

<EmptyState
	title="Aucun résultat trouvé"
	description="Essayez de modifier vos critères de recherche."
	illustration={
		<Image
			src="/illustrations/empty-search.svg"
			alt="No results"
			width={200}
			height={200}
		/>
	}
/>;
```

## Contenu personnalisé

```tsx
<EmptyState icon={Search} title="Aucun résultat trouvé">
	<div className="mt-4">
		<p>Voici quelques suggestions :</p>
		<ul className="list-disc mt-2 text-left pl-4">
			<li>Vérifiez l'orthographe des termes de recherche</li>
			<li>Utilisez des mots-clés plus généraux</li>
			<li>Réduisez le nombre de filtres appliqués</li>
		</ul>
	</div>
</EmptyState>
```

## Props

| Prop           | Type              | Description                   | Défaut |
| -------------- | ----------------- | ----------------------------- | ------ |
| `className`    | `string`          | Classes CSS additionnelles    | -      |
| `icon`         | `LucideIcon`      | Icône Lucide                  | -      |
| `title`        | `string`          | Titre principal (obligatoire) | -      |
| `description`  | `string`          | Description                   | -      |
| `action`       | `React.ReactNode` | Action principale             | -      |
| `children`     | `React.ReactNode` | Contenu personnalisé          | -      |
| `illustration` | `React.ReactNode` | Illustration personnalisée    | -      |
