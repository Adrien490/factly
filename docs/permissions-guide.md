# Guide de Gestion des Droits et Permissions

## Vue d'ensemble

Le système de gestion des droits de votre application utilise un modèle RBAC (Role-Based Access Control) avec les composants suivants :

- **Utilisateurs** : Comptes utilisateur de base
- **Membres** : Utilisateurs appartenant à l'organisation
- **Rôles** : Groupes de permissions (Admin, Manager, User, Viewer)
- **Permissions** : Actions spécifiques sur des ressources

## Architecture

### Modèles Prisma

```prisma
model Member {
  memberRoles MemberRole[] // Relations vers les rôles
}

model Role {
  name        String @unique // "admin", "manager", "user", "viewer"
  displayName String         // "Administrateur", "Gestionnaire"
  isSystem    Boolean        // Rôles système non supprimables
  rolePermissions RolePermission[]
}

model Permission {
  name     String @unique // "clients:read", "members:manage"
  resource String         // "clients", "members", "products"
  action   String         // "read", "write", "delete", "manage"
}
```

### Rôles Prédéfinis

| Rôle        | Description            | Permissions                                          |
| ----------- | ---------------------- | ---------------------------------------------------- |
| **Admin**   | Accès complet          | Toutes les permissions `*:manage`                    |
| **Manager** | Gestion opérationnelle | Lecture/écriture sur clients, produits, fournisseurs |
| **User**    | Utilisateur standard   | Lecture/écriture limitée                             |
| **Viewer**  | Lecture seule          | Permissions `*:read` uniquement                      |

### Format des Permissions

Les permissions suivent le format `resource:action` :

- `clients:read` - Lire les clients
- `clients:write` - Modifier les clients
- `clients:create` - Créer des clients
- `clients:delete` - Supprimer des clients
- `clients:manage` - Gestion complète des clients

## Installation et Configuration

### 1. Migration de la Base de Données

```bash
# Appliquer les nouveaux modèles
npx prisma db push

# Ou créer une migration
npx prisma migrate dev --name add-permissions-system
```

### 2. Initialisation des Rôles et Permissions

```bash
# Exécuter le script d'initialisation
npx tsx scripts/init-permissions.ts
```

Ce script va :

- Créer toutes les permissions définies
- Créer les 4 rôles système
- Associer les permissions aux rôles
- Assigner le rôle admin au premier membre

### 3. Vérification

```bash
# Vérifier que les données ont été créées
npx prisma studio
```

## Utilisation dans le Code

### Actions Serveur

#### Méthode 1 : Middleware de Permissions (Recommandée)

```typescript
import { requirePermission } from "@/domains/auth/lib/permission-middleware";

export const updateClient = async (_, formData) => {
	// Vérification automatique de l'auth + membership + permission
	const authResult = await requirePermission("clients:update");
	if (authResult.error) {
		return authResult.error;
	}

	const { userId, user, member } = authResult;

	// Votre logique métier...
};
```

#### Méthode 2 : Vérification Manuelle

```typescript
import { hasPermission } from "@/domains/auth/lib/permissions";

export const deleteClient = async (_, formData) => {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!(await hasPermission(session.user.id, "clients:delete"))) {
		return createErrorResponse(ActionStatus.FORBIDDEN, "Permission refusée");
	}

	// Votre logique métier...
};
```

### Composants React

#### Protection par Permission

```tsx
import { PermissionGuard } from "@/domains/auth/components/permission-guard";

function ClientActions() {
	return (
		<div>
			{/* Visible pour tous les membres */}
			<ViewClientButton />

			{/* Visible uniquement avec permission clients:update */}
			<PermissionGuard permission="clients:update">
				<EditClientButton />
			</PermissionGuard>

			{/* Visible uniquement avec permission clients:delete */}
			<PermissionGuard
				permission="clients:delete"
				fallback={<span>Action non autorisée</span>}
			>
				<DeleteClientButton />
			</PermissionGuard>
		</div>
	);
}
```

#### Hook de Permissions

```tsx
import { usePermissions } from "@/domains/auth/components/permission-guard";

function ClientPage() {
	const { hasPermission, loading } = usePermissions();

	if (loading) return <div>Chargement...</div>;

	return (
		<div>
			<h1>Clients</h1>

			{hasPermission("clients:create") && <CreateClientButton />}

			{hasPermission("clients:update") && <BulkEditButton />}
		</div>
	);
}
```

### Vérifications Multiples

```tsx
// Toutes les permissions requises
<MultiplePermissionGuard
  permissions={["clients:read", "clients:update"]}
  requireAll={true}
>
  <AdvancedClientEditor />
</MultiplePermissionGuard>

// Au moins une permission requise
<MultiplePermissionGuard
  permissions={["clients:read", "products:read"]}
  requireAll={false}
>
  <DashboardWidget />
</MultiplePermissionGuard>
```

## Gestion des Rôles

### Assigner un Rôle à un Membre

```typescript
// Dans une action serveur
await db.memberRole.create({
	data: {
		memberId: "member-id",
		roleId: "role-id",
		assignedBy: session.user.id, // Qui a assigné le rôle
		expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Optionnel
	},
});

// Invalider le cache des permissions
revalidateTag(`permissions:${memberId}`);
```

### Retirer un Rôle

```typescript
await db.memberRole.delete({
	where: {
		memberId_roleId: {
			memberId: "member-id",
			roleId: "role-id",
		},
	},
});
```

### Vérifier les Rôles

```typescript
import { hasRole, isAdmin } from "@/domains/auth/lib/permissions";

// Vérifier un rôle spécifique
if (await hasRole(userId, "admin")) {
	// L'utilisateur est admin
}

// Vérifier si admin (raccourci)
if (await isAdmin(userId)) {
	// L'utilisateur est admin
}
```

## Permissions Personnalisées

### Ajouter de Nouvelles Permissions

1. **Mettre à jour les types** dans `domains/auth/lib/permissions.ts` :

```typescript
export type Resource =
	| "clients"
	| "members"
	| "invoices" // Nouvelle ressource
	| "reports"; // Nouvelle ressource

// Nouvelles permissions disponibles :
// "invoices:read", "invoices:create", "reports:generate", etc.
```

2. **Mettre à jour les rôles par défaut** :

```typescript
export const DEFAULT_ROLE_PERMISSIONS = {
	[SYSTEM_ROLES.MANAGER]: [
		"clients:read",
		"invoices:read", // Nouvelle permission
		"invoices:create", // Nouvelle permission
		"reports:generate", // Nouvelle permission
	],
	// ...
};
```

3. **Réexécuter le script d'initialisation** :

```bash
npx tsx scripts/init-permissions.ts
```

### Créer des Rôles Personnalisés

```typescript
// Créer un nouveau rôle
const customRole = await db.role.create({
	data: {
		name: "accountant",
		displayName: "Comptable",
		description: "Accès aux fonctionnalités comptables",
		isSystem: false, // Rôle personnalisé
	},
});

// Assigner des permissions spécifiques
const permissions = await db.permission.findMany({
	where: {
		name: {
			in: ["invoices:read", "invoices:create", "reports:generate"],
		},
	},
});

for (const permission of permissions) {
	await db.rolePermission.create({
		data: {
			roleId: customRole.id,
			permissionId: permission.id,
		},
	});
}
```

## Bonnes Pratiques

### 1. Principe du Moindre Privilège

- Accordez uniquement les permissions nécessaires
- Commencez par le rôle `viewer` et ajoutez des permissions au besoin

### 2. Vérifications Côté Serveur

- **Toujours** vérifier les permissions côté serveur
- Les composants React sont pour l'UX, pas la sécurité

### 3. Cache et Performance

- Les permissions sont mises en cache automatiquement
- Invalidez le cache après modification des rôles

### 4. Audit et Traçabilité

- Utilisez le champ `assignedBy` pour tracer qui a assigné les rôles
- Considérez ajouter des logs pour les changements de permissions

### 5. Gestion des Erreurs

- Fournissez des messages d'erreur clairs
- Utilisez des fallbacks appropriés dans l'UI

## Exemples Complets

### Page Protégée

```tsx
// app/dashboard/admin/page.tsx
import { requirePermission } from "@/domains/auth/lib/permission-middleware";
import { redirect } from "next/navigation";

export default async function AdminPage() {
	const authResult = await requirePermission("settings:manage");

	if (authResult.error) {
		redirect("/dashboard/forbidden");
	}

	return (
		<div>
			<h1>Administration</h1>
			{/* Contenu admin */}
		</div>
	);
}
```

### Action avec Permissions Multiples

```typescript
export const generateReport = async (_, formData) => {
	const authResult = await requireAllPermissions([
		"reports:generate",
		"clients:read",
		"products:read",
	]);

	if (authResult.error) {
		return authResult.error;
	}

	// Générer le rapport...
};
```

### Interface Adaptative

```tsx
function Toolbar() {
	const { hasPermission } = usePermissions();

	return (
		<div className="flex gap-2">
			{hasPermission("clients:create") && <CreateButton />}
			{hasPermission("clients:update") && <EditButton />}
			{hasPermission("clients:delete") && <DeleteButton />}
			{hasPermission("reports:generate") && <ReportButton />}
		</div>
	);
}
```

## Dépannage

### Problèmes Courants

1. **Permissions non mises à jour** : Vérifiez que le cache est invalidé
2. **Erreur "Permission not found"** : Réexécutez le script d'initialisation
3. **Utilisateur sans rôle** : Assignez au moins le rôle `viewer`

### Debug

```typescript
// Voir toutes les permissions d'un utilisateur
const permissions = await getUserPermissions(userId);
console.log("Permissions:", permissions);

// Voir tous les rôles d'un utilisateur
const roles = await getUserRoles(userId);
console.log("Rôles:", roles);
```

Ce système vous offre une gestion fine et flexible des droits d'accès tout en restant simple à utiliser et maintenir.
