# Breadcrumbs

Un composant de fil d'Ariane (breadcrumbs) pour faciliter la navigation et montrer le chemin courant de l'utilisateur dans l'application.

## Fonctionnalités

- Navigation hiérarchique claire
- Support des liens actifs et inactifs
- Séparateurs visuels (chevron)
- Intégration avec Next.js Link
- Accessibilité renforcée (attributs ARIA)

## Installation

Le composant est disponible dans le dossier `shared/components/breadcrumbs`.

## Utilisation de base

```tsx
import { Breadcrumbs } from "@/shared/components/breadcrumbs";

<Breadcrumbs
	items={[
		{ label: "Accueil", href: "/" },
		{ label: "Clients", href: "/clients" },
		{ label: "Détails client" }, // Élément actif (sans href)
	]}
/>;
```

## Personnalisation

```tsx
import { Breadcrumbs } from "@/shared/components/breadcrumbs";

<Breadcrumbs
	items={[
		{ label: "Tableau de bord", href: "/dashboard" },
		{ label: "Projets", href: "/dashboard/projects" },
		{ label: "Projet Alpha", href: "/dashboard/projects/alpha" },
		{ label: "Configuration" },
	]}
	className="text-sm font-medium py-2"
/>;
```

## Props

| Prop        | Type               | Description                            | Défaut |
| ----------- | ------------------ | -------------------------------------- | ------ |
| `items`     | `BreadcrumbItem[]` | Éléments du fil d'Ariane (obligatoire) | -      |
| `className` | `string`           | Classes CSS additionnelles             | -      |

## Structure BreadcrumbItem

| Propriété | Type     | Description                                              | Requis |
| --------- | -------- | -------------------------------------------------------- | ------ |
| `label`   | `string` | Texte affiché pour l'élément                             | Oui    |
| `href`    | `string` | Lien vers lequel naviguer (optionnel pour élément actif) | Non    |
