import { PermissionType, PrismaClient } from "@prisma/client";
import console from "console";

// Rôles système
export const SYSTEM_ROLES = {
	ADMIN: "admin",
	MANAGER: "manager",
	USER: "user",
	VIEWER: "viewer",
} as const;

// Mapping entre l'enum et les noms d'affichage
export const PERMISSION_NAMES: Record<PermissionType, string> = {
	// Clients
	CLIENTS_READ: "Lire les clients",
	CLIENTS_WRITE: "Écrire les clients",
	CLIENTS_CREATE: "Créer les clients",
	CLIENTS_UPDATE: "Modifier les clients",
	CLIENTS_DELETE: "Supprimer les clients",

	// Membres
	MEMBERS_READ: "Lire les membres",
	MEMBERS_MANAGE: "Gérer les membres",

	// Produits
	PRODUCTS_READ: "Lire les produits",
	PRODUCTS_WRITE: "Écrire les produits",
	PRODUCTS_CREATE: "Créer les produits",
	PRODUCTS_UPDATE: "Modifier les produits",
	PRODUCTS_DELETE: "Supprimer les produits",
	PRODUCTS_MANAGE: "Gérer les produits",

	// Fournisseurs
	SUPPLIERS_READ: "Lire les fournisseurs",
	SUPPLIERS_WRITE: "Écrire les fournisseurs",
	SUPPLIERS_CREATE: "Créer les fournisseurs",
	SUPPLIERS_UPDATE: "Modifier les fournisseurs",
	SUPPLIERS_DELETE: "Supprimer les fournisseurs",
	SUPPLIERS_MANAGE: "Gérer les fournisseurs",

	// Entreprises
	COMPANIES_READ: "Lire les entreprises",
	COMPANIES_UPDATE: "Modifier les entreprises",
	COMPANIES_MANAGE: "Gérer les entreprises",

	// Paramètres
	SETTINGS_MANAGE: "Gérer les paramètres",

	// Années fiscales
	FISCAL_YEARS_MANAGE: "Gérer les années fiscales",

	// Adresses
	ADDRESSES_READ: "Lire les adresses",
	ADDRESSES_WRITE: "Écrire les adresses",
	ADDRESSES_MANAGE: "Gérer les adresses",

	// Contacts
	CONTACTS_READ: "Lire les contacts",
	CONTACTS_WRITE: "Écrire les contacts",
	CONTACTS_MANAGE: "Gérer les contacts",
};

// Permissions par défaut pour chaque rôle
export const DEFAULT_ROLE_PERMISSIONS: Record<string, PermissionType[]> = {
	[SYSTEM_ROLES.ADMIN]: [
		PermissionType.MEMBERS_MANAGE,
		PermissionType.PRODUCTS_MANAGE,
		PermissionType.SUPPLIERS_MANAGE,
		PermissionType.COMPANIES_MANAGE,
		PermissionType.SETTINGS_MANAGE,
		PermissionType.FISCAL_YEARS_MANAGE,
		PermissionType.ADDRESSES_MANAGE,
		PermissionType.CONTACTS_MANAGE,
		// Clients (toutes les permissions individuelles car pas de MANAGE)
		PermissionType.CLIENTS_READ,
		PermissionType.CLIENTS_WRITE,
		PermissionType.CLIENTS_CREATE,
		PermissionType.CLIENTS_UPDATE,
		PermissionType.CLIENTS_DELETE,
	],
	[SYSTEM_ROLES.MANAGER]: [
		PermissionType.CLIENTS_READ,
		PermissionType.CLIENTS_WRITE,
		PermissionType.CLIENTS_CREATE,
		PermissionType.CLIENTS_UPDATE,
		PermissionType.MEMBERS_READ,
		PermissionType.PRODUCTS_READ,
		PermissionType.PRODUCTS_WRITE,
		PermissionType.PRODUCTS_CREATE,
		PermissionType.PRODUCTS_UPDATE,
		PermissionType.SUPPLIERS_READ,
		PermissionType.SUPPLIERS_WRITE,
		PermissionType.SUPPLIERS_CREATE,
		PermissionType.SUPPLIERS_UPDATE,
		PermissionType.COMPANIES_READ,
		PermissionType.COMPANIES_UPDATE,
		PermissionType.ADDRESSES_MANAGE,
		PermissionType.CONTACTS_MANAGE,
	],
	[SYSTEM_ROLES.USER]: [
		PermissionType.CLIENTS_READ,
		PermissionType.CLIENTS_WRITE,
		PermissionType.CLIENTS_CREATE,
		PermissionType.CLIENTS_UPDATE,
		PermissionType.PRODUCTS_READ,
		PermissionType.SUPPLIERS_READ,
		PermissionType.COMPANIES_READ,
		PermissionType.ADDRESSES_READ,
		PermissionType.ADDRESSES_WRITE,
		PermissionType.CONTACTS_READ,
		PermissionType.CONTACTS_WRITE,
	],
	[SYSTEM_ROLES.VIEWER]: [
		PermissionType.CLIENTS_READ,
		PermissionType.PRODUCTS_READ,
		PermissionType.SUPPLIERS_READ,
		PermissionType.COMPANIES_READ,
		PermissionType.ADDRESSES_READ,
		PermissionType.CONTACTS_READ,
	],
};

// Descriptions des permissions
const PERMISSION_DESCRIPTIONS: Record<PermissionType, string> = {
	// Clients
	CLIENTS_READ: "Consulter la liste et les détails des clients",
	CLIENTS_WRITE: "Modifier les informations des clients existants",
	CLIENTS_CREATE: "Créer de nouveaux clients",
	CLIENTS_UPDATE: "Mettre à jour les informations des clients",
	CLIENTS_DELETE: "Supprimer des clients",

	// Membres
	MEMBERS_READ: "Consulter la liste des membres",
	MEMBERS_MANAGE: "Gestion complète des membres et de leurs rôles",

	// Produits
	PRODUCTS_READ: "Consulter le catalogue produits",
	PRODUCTS_WRITE: "Modifier les produits existants",
	PRODUCTS_CREATE: "Créer de nouveaux produits",
	PRODUCTS_UPDATE: "Mettre à jour les informations produits",
	PRODUCTS_DELETE: "Supprimer des produits",
	PRODUCTS_MANAGE: "Gestion complète du catalogue produits",

	// Fournisseurs
	SUPPLIERS_READ: "Consulter la liste des fournisseurs",
	SUPPLIERS_WRITE: "Modifier les fournisseurs existants",
	SUPPLIERS_CREATE: "Créer de nouveaux fournisseurs",
	SUPPLIERS_UPDATE: "Mettre à jour les informations fournisseurs",
	SUPPLIERS_DELETE: "Supprimer des fournisseurs",
	SUPPLIERS_MANAGE: "Gestion complète des fournisseurs",

	// Entreprises
	COMPANIES_READ: "Consulter les informations d'entreprise",
	COMPANIES_UPDATE: "Modifier les informations d'entreprise",
	COMPANIES_MANAGE: "Gestion complète des entreprises",

	// Paramètres
	SETTINGS_MANAGE: "Gestion des paramètres système",

	// Années fiscales
	FISCAL_YEARS_MANAGE: "Gestion des années fiscales",

	// Adresses
	ADDRESSES_READ: "Consulter les adresses",
	ADDRESSES_WRITE: "Modifier les adresses",
	ADDRESSES_MANAGE: "Gestion complète des adresses",

	// Contacts
	CONTACTS_READ: "Consulter les contacts",
	CONTACTS_WRITE: "Modifier les contacts",
	CONTACTS_MANAGE: "Gestion complète des contacts",
};

/**
 * Initialise les permissions et rôles dans la base de données
 * @param db Instance Prisma Client
 * @param assignAdminToUserId ID de l'utilisateur à qui assigner le rôle admin (optionnel)
 */
export async function initPermissions(
	db: PrismaClient,
	assignAdminToUserId?: string
) {
	console.log("🚀 Initialisation des rôles et permissions...");

	try {
		// 1. Créer toutes les permissions
		console.log("📝 Création des permissions...");

		for (const [permissionType, permissionName] of Object.entries(
			PERMISSION_NAMES
		)) {
			await db.permission.upsert({
				where: { type: permissionType as PermissionType },
				update: {
					name: permissionName,
					description:
						PERMISSION_DESCRIPTIONS[permissionType as PermissionType],
				},
				create: {
					type: permissionType as PermissionType,
					name: permissionName,
					description:
						PERMISSION_DESCRIPTIONS[permissionType as PermissionType],
				},
			});
		}

		// 2. Créer les rôles système
		console.log("👥 Création des rôles système...");

		const roles = [
			{
				name: SYSTEM_ROLES.ADMIN,
				displayName: "Administrateur",
				description: "Accès complet à toutes les fonctionnalités",
				isSystem: true,
			},
			{
				name: SYSTEM_ROLES.MANAGER,
				displayName: "Gestionnaire",
				description: "Gestion des clients, produits et fournisseurs",
				isSystem: true,
			},
			{
				name: SYSTEM_ROLES.USER,
				displayName: "Utilisateur",
				description: "Accès en lecture/écriture aux données principales",
				isSystem: true,
			},
			{
				name: SYSTEM_ROLES.VIEWER,
				displayName: "Lecteur",
				description: "Accès en lecture seule",
				isSystem: true,
			},
		];

		for (const roleData of roles) {
			await db.role.upsert({
				where: { name: roleData.name },
				update: {
					displayName: roleData.displayName,
					description: roleData.description,
				},
				create: roleData,
			});
		}

		// 3. Associer les permissions aux rôles
		console.log("🔗 Association des permissions aux rôles...");

		for (const [roleName, permissions] of Object.entries(
			DEFAULT_ROLE_PERMISSIONS
		)) {
			const role = await db.role.findUnique({
				where: { name: roleName },
			});

			if (!role) continue;

			// Supprimer les anciennes associations
			await db.rolePermission.deleteMany({
				where: { roleId: role.id },
			});

			// Créer les nouvelles associations
			for (const permissionType of permissions) {
				const permission = await db.permission.findUnique({
					where: { type: permissionType },
				});

				if (permission) {
					await db.rolePermission.create({
						data: {
							roleId: role.id,
							permissionId: permission.id,
						},
					});
				}
			}

			console.log(
				`  ✅ ${permissions.length} permissions assignées au rôle ${roleName}`
			);
		}

		// 4. Assigner le rôle admin à l'utilisateur spécifié ou au premier membre
		let targetUserId = assignAdminToUserId;

		if (!targetUserId) {
			const firstMember = await db.member.findFirst({
				orderBy: { createdAt: "asc" },
			});
			targetUserId = firstMember?.userId;
		}

		if (targetUserId) {
			// Vérifier si l'utilisateur est membre, sinon le créer
			const member = await db.member.upsert({
				where: { userId: targetUserId },
				update: {},
				create: { userId: targetUserId },
			});

			const adminRole = await db.role.findUnique({
				where: { name: SYSTEM_ROLES.ADMIN },
			});

			if (adminRole) {
				await db.memberRole.upsert({
					where: {
						memberId_roleId: {
							memberId: member.id,
							roleId: adminRole.id,
						},
					},
					update: {},
					create: {
						memberId: member.id,
						roleId: adminRole.id,
					},
				});
				console.log("👑 Rôle administrateur assigné");
			}
		}

		console.log("✅ Initialisation terminée avec succès !");
		return true;
	} catch (error) {
		console.error("❌ Erreur lors de l'initialisation :", error);
		throw error;
	}
}
