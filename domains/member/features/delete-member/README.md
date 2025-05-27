# Feature: Delete Member

Cette feature permet de retirer un membre de l'organisation. Elle inclut des protections pour empêcher l'auto-suppression et des confirmations utilisateur.

## Structure

```
delete-member/
├── actions/
│   └── delete-member.ts          # Action serveur pour supprimer un membre
├── components/
│   ├── delete-member-button.tsx  # Bouton de suppression simple
│   ├── delete-member-alert-dialog.tsx # Dialogue de confirmation
│   ├── member-delete-menu-item.tsx    # Item de menu pour dropdown
│   └── index.ts
├── hooks/
│   └── use-delete-member.ts      # Hook React pour gérer la suppression
├── schemas/
│   └── index.ts                  # Schémas de validation Zod
└── index.ts
```

## Utilisation

### Composant simple avec dialogue de confirmation

```tsx
import { DeleteMemberAlertDialog } from "@/domains/member/features/delete-member";
import { Button } from "@/shared/components";

function MemberCard({ member }) {
	return (
		<div>
			<h3>{member.user.name}</h3>
			<DeleteMemberAlertDialog id={member.id} memberName={member.user.name}>
				<Button variant="destructive">Retirer de l'organisation</Button>
			</DeleteMemberAlertDialog>
		</div>
	);
}
```

### Dans un menu dropdown

```tsx
import { MemberDeleteMenuItem } from "@/domains/member/features/delete-member";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/shared/components";

function MemberActions({ member, canDelete }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>Actions</DropdownMenuTrigger>
			<DropdownMenuContent>
				<MemberDeleteMenuItem
					memberId={member.id}
					memberName={member.user.name}
					disabled={!canDelete}
				/>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
```

### Utilisation directe du hook

```tsx
import { useDeleteMember } from "@/domains/member/features/delete-member";

function CustomDeleteButton({ memberId }) {
	const { dispatch, isPending } = useDeleteMember();

	const handleDelete = () => {
		const formData = new FormData();
		formData.append("id", memberId);
		dispatch(formData);
	};

	return (
		<button onClick={handleDelete} disabled={isPending}>
			{isPending ? "Suppression..." : "Supprimer"}
		</button>
	);
}
```

## Protections

- **Authentification requise** : L'utilisateur doit être connecté
- **Auto-suppression interdite** : Un membre ne peut pas se supprimer lui-même
- **Confirmation utilisateur** : Dialogue de confirmation avant suppression
- **Validation des données** : Validation Zod des paramètres
- **Gestion d'erreurs** : Messages d'erreur appropriés

## Cache et revalidation

La suppression invalide automatiquement les caches suivants :

- `members` : Liste des membres
- `members:count` : Nombre de membres
- `membership:${userId}` : Statut d'appartenance de l'utilisateur supprimé

## Types

```typescript
// Paramètres de suppression
type DeleteMemberParams = {
	id: string;
};

// Retour de l'action
type DeleteMemberReturn = ServerActionResponse<Member>;
```
