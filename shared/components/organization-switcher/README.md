# OrganizationSwitcher

Un composant permettant de basculer facilement entre différentes organisations auxquelles l'utilisateur a accès.

## Fonctionnalités

- Liste déroulante des organisations accessibles
- Affichage des logos et noms des organisations
- Gestion de l'organisation active
- Support pour la création d'une nouvelle organisation
- Interface responsive et accessible
- Mise à jour de la session lors du changement d'organisation

## Installation

Le composant est disponible dans le dossier `shared/components/organization-switcher`.

## Utilisation

```tsx
import { OrganizationSwitcher } from "@/shared/components/organization-switcher";

export default function Header() {
	return (
		<header className="flex items-center justify-between p-4">
			<div className="flex items-center gap-4">
				<Logo />
				<OrganizationSwitcher />
			</div>
			<UserMenu />
		</header>
	);
}
```

## Props

| Prop        | Type                     | Description                | Requis | Par défaut  |
| ----------- | ------------------------ | -------------------------- | ------ | ----------- |
| `className` | `string`                 | Classes CSS additionnelles | Non    | `undefined` |
| `variant`   | `"default" \| "sidebar"` | Variante d'affichage       | Non    | `"default"` |

## Hooks associés

### useOrganizationSwitcher

Gère la logique de récupération des organisations et de changement d'organisation.

```tsx
import { useOrganizationSwitcher } from "@/sharedts/organization-switcher/hooks";

function MonComposant() {
	const { organizations, activeOrganization, isPending, switchOrganization } =
		useOrganizationSwitcher();

	return (
		<div>
			<h2>Choisissez une organisation:</h2>
			<ul>
				{organizations.map((org) => (
					<li
						key={org.id}
						onClick={() => switchOrganization(org.id)}
						className={org.id === activeOrganization?.id ? "active" : ""}
					>
						{org.name}
					</li>
				))}
			</ul>
		</div>
	);
}
```

### Retour du hook

| Propriété            | Type                   | Description                              |
| -------------------- | ---------------------- | ---------------------------------------- |
| `organizations`      | `Organization[]`       | Liste des organisations de l'utilisateur |
| `activeOrganization` | `Organization \| null` | Organisation actuellement active         |
| `isPending`          | `boolean`              | Indique si une opération est en cours    |
| `switchOrganization` | `(id: string) => void` | Fonction pour changer d'organisation     |
| `error`              | `Error \| null`        | Erreur survenue lors du chargement       |

## Structure des fichiers

```
organization-switcher/
├── components/        # Composants UI
│   ├── index.ts
│   └── organization-switcher.tsx
├── hooks/             # Logique et état
│   └── use-organization-switcher.ts
├── types/             # Types TypeScript
│   ├── index.ts
│   └── organization.ts
└── index.tsx          # Point d'entrée
```

## Dépendances

- Next.js (utilisation du routeur)
- React
- Lucide React (icônes)
- Radix UI / Shadcn (composants Select, DropdownMenu)
- Prisma Client (modèle Organization)
