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
	MEMBERS_WRITE: "Écrire les membres",
	MEMBERS_CREATE: "Créer les membres",
	MEMBERS_UPDATE: "Modifier les membres",
	MEMBERS_DELETE: "Supprimer les membres",

	// Produits
	PRODUCTS_READ: "Lire les produits",
	PRODUCTS_WRITE: "Écrire les produits",
	PRODUCTS_CREATE: "Créer les produits",
	PRODUCTS_UPDATE: "Modifier les produits",
	PRODUCTS_DELETE: "Supprimer les produits",

	// Fournisseurs
	SUPPLIERS_READ: "Lire les fournisseurs",
	SUPPLIERS_WRITE: "Écrire les fournisseurs",
	SUPPLIERS_CREATE: "Créer les fournisseurs",
	SUPPLIERS_UPDATE: "Modifier les fournisseurs",
	SUPPLIERS_DELETE: "Supprimer les fournisseurs",

	// Entreprises
	COMPANIES_READ: "Lire les entreprises",
	COMPANIES_WRITE: "Écrire les entreprises",
	COMPANIES_UPDATE: "Modifier les entreprises",

	// Paramètres
	SETTINGS_READ: "Lire les paramètres",
	SETTINGS_WRITE: "Écrire les paramètres",
	SETTINGS_UPDATE: "Modifier les paramètres",

	// Années fiscales
	FISCAL_YEARS_READ: "Lire les années fiscales",
	FISCAL_YEARS_WRITE: "Écrire les années fiscales",
	FISCAL_YEARS_CREATE: "Créer les années fiscales",
	FISCAL_YEARS_UPDATE: "Modifier les années fiscales",
	FISCAL_YEARS_DELETE: "Supprimer les années fiscales",

	// Adresses
	ADDRESSES_READ: "Lire les adresses",
	ADDRESSES_WRITE: "Écrire les adresses",
	ADDRESSES_CREATE: "Créer les adresses",
	ADDRESSES_UPDATE: "Modifier les adresses",
	ADDRESSES_DELETE: "Supprimer les adresses",

	// Contacts
	CONTACTS_READ: "Lire les contacts",
	CONTACTS_WRITE: "Écrire les contacts",
	CONTACTS_CREATE: "Créer les contacts",
	CONTACTS_UPDATE: "Modifier les contacts",
	CONTACTS_DELETE: "Supprimer les contacts",
};

// Permissions par défaut pour chaque rôle
export const DEFAULT_ROLE_PERMISSIONS: Record<string, PermissionType[]> = {
	[SYSTEM_ROLES.ADMIN]: [
		// Clients - toutes les permissions
		PermissionType.CLIENTS_READ,
		PermissionType.CLIENTS_WRITE,
		PermissionType.CLIENTS_CREATE,
		PermissionType.CLIENTS_UPDATE,
		PermissionType.CLIENTS_DELETE,

		// Membres - toutes les permissions
		PermissionType.MEMBERS_READ,
		PermissionType.MEMBERS_WRITE,
		PermissionType.MEMBERS_CREATE,
		PermissionType.MEMBERS_UPDATE,
		PermissionType.MEMBERS_DELETE,

		// Produits - toutes les permissions
		PermissionType.PRODUCTS_READ,
		PermissionType.PRODUCTS_WRITE,
		PermissionType.PRODUCTS_CREATE,
		PermissionType.PRODUCTS_UPDATE,
		PermissionType.PRODUCTS_DELETE,

		// Fournisseurs - toutes les permissions
		PermissionType.SUPPLIERS_READ,
		PermissionType.SUPPLIERS_WRITE,
		PermissionType.SUPPLIERS_CREATE,
		PermissionType.SUPPLIERS_UPDATE,
		PermissionType.SUPPLIERS_DELETE,

		// Entreprises - toutes les permissions
		PermissionType.COMPANIES_READ,
		PermissionType.COMPANIES_WRITE,
		PermissionType.COMPANIES_UPDATE,

		// Paramètres - toutes les permissions
		PermissionType.SETTINGS_READ,
		PermissionType.SETTINGS_WRITE,
		PermissionType.SETTINGS_UPDATE,

		// Années fiscales - toutes les permissions
		PermissionType.FISCAL_YEARS_READ,
		PermissionType.FISCAL_YEARS_WRITE,
		PermissionType.FISCAL_YEARS_CREATE,
		PermissionType.FISCAL_YEARS_UPDATE,
		PermissionType.FISCAL_YEARS_DELETE,

		// Adresses - toutes les permissions
		PermissionType.ADDRESSES_READ,
		PermissionType.ADDRESSES_WRITE,
		PermissionType.ADDRESSES_CREATE,
		PermissionType.ADDRESSES_UPDATE,
		PermissionType.ADDRESSES_DELETE,

		// Contacts - toutes les permissions
		PermissionType.CONTACTS_READ,
		PermissionType.CONTACTS_WRITE,
		PermissionType.CONTACTS_CREATE,
		PermissionType.CONTACTS_UPDATE,
		PermissionType.CONTACTS_DELETE,
	],
	[SYSTEM_ROLES.MANAGER]: [
		// Clients - lecture, écriture, création, modification
		PermissionType.CLIENTS_READ,
		PermissionType.CLIENTS_WRITE,
		PermissionType.CLIENTS_CREATE,
		PermissionType.CLIENTS_UPDATE,

		// Membres - lecture seulement
		PermissionType.MEMBERS_READ,

		// Produits - lecture, écriture, création, modification
		PermissionType.PRODUCTS_READ,
		PermissionType.PRODUCTS_WRITE,
		PermissionType.PRODUCTS_CREATE,
		PermissionType.PRODUCTS_UPDATE,

		// Fournisseurs - lecture, écriture, création, modification
		PermissionType.SUPPLIERS_READ,
		PermissionType.SUPPLIERS_WRITE,
		PermissionType.SUPPLIERS_CREATE,
		PermissionType.SUPPLIERS_UPDATE,

		// Entreprises - lecture et modification
		PermissionType.COMPANIES_READ,
		PermissionType.COMPANIES_UPDATE,

		// Adresses - toutes les permissions
		PermissionType.ADDRESSES_READ,
		PermissionType.ADDRESSES_WRITE,
		PermissionType.ADDRESSES_CREATE,
		PermissionType.ADDRESSES_UPDATE,
		PermissionType.ADDRESSES_DELETE,

		// Contacts - toutes les permissions
		PermissionType.CONTACTS_READ,
		PermissionType.CONTACTS_WRITE,
		PermissionType.CONTACTS_CREATE,
		PermissionType.CONTACTS_UPDATE,
		PermissionType.CONTACTS_DELETE,
	],
	[SYSTEM_ROLES.USER]: [
		// Clients - lecture, écriture, création, modification
		PermissionType.CLIENTS_READ,
		PermissionType.CLIENTS_WRITE,
		PermissionType.CLIENTS_CREATE,
		PermissionType.CLIENTS_UPDATE,

		// Produits - lecture seulement
		PermissionType.PRODUCTS_READ,

		// Fournisseurs - lecture seulement
		PermissionType.SUPPLIERS_READ,

		// Entreprises - lecture seulement
		PermissionType.COMPANIES_READ,

		// Adresses - lecture et écriture
		PermissionType.ADDRESSES_READ,
		PermissionType.ADDRESSES_WRITE,

		// Contacts - lecture et écriture
		PermissionType.CONTACTS_READ,
		PermissionType.CONTACTS_WRITE,
	],
	[SYSTEM_ROLES.VIEWER]: [
		// Lecture seule sur tout
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
	MEMBERS_WRITE: "Modifier les informations des membres",
	MEMBERS_CREATE: "Créer de nouveaux membres",
	MEMBERS_UPDATE: "Mettre à jour les informations des membres",
	MEMBERS_DELETE: "Supprimer des membres",

	// Produits
	PRODUCTS_READ: "Consulter le catalogue produits",
	PRODUCTS_WRITE: "Modifier les produits existants",
	PRODUCTS_CREATE: "Créer de nouveaux produits",
	PRODUCTS_UPDATE: "Mettre à jour les informations produits",
	PRODUCTS_DELETE: "Supprimer des produits",

	// Fournisseurs
	SUPPLIERS_READ: "Consulter la liste des fournisseurs",
	SUPPLIERS_WRITE: "Modifier les fournisseurs existants",
	SUPPLIERS_CREATE: "Créer de nouveaux fournisseurs",
	SUPPLIERS_UPDATE: "Mettre à jour les informations fournisseurs",
	SUPPLIERS_DELETE: "Supprimer des fournisseurs",

	// Entreprises
	COMPANIES_READ: "Consulter les informations d'entreprise",
	COMPANIES_WRITE: "Modifier les informations d'entreprise",
	COMPANIES_UPDATE: "Mettre à jour les informations d'entreprise",

	// Paramètres
	SETTINGS_READ: "Consulter les paramètres système",
	SETTINGS_WRITE: "Modifier les paramètres système",
	SETTINGS_UPDATE: "Mettre à jour les paramètres système",

	// Années fiscales
	FISCAL_YEARS_READ: "Consulter les années fiscales",
	FISCAL_YEARS_WRITE: "Modifier les années fiscales",
	FISCAL_YEARS_CREATE: "Créer de nouvelles années fiscales",
	FISCAL_YEARS_UPDATE: "Mettre à jour les années fiscales",
	FISCAL_YEARS_DELETE: "Supprimer des années fiscales",

	// Adresses
	ADDRESSES_READ: "Consulter les adresses",
	ADDRESSES_WRITE: "Modifier les adresses",
	ADDRESSES_CREATE: "Créer de nouvelles adresses",
	ADDRESSES_UPDATE: "Mettre à jour les adresses",
	ADDRESSES_DELETE: "Supprimer des adresses",

	// Contacts
	CONTACTS_READ: "Consulter les contacts",
	CONTACTS_WRITE: "Modifier les contacts",
	CONTACTS_CREATE: "Créer de nouveaux contacts",
	CONTACTS_UPDATE: "Mettre à jour les contacts",
	CONTACTS_DELETE: "Supprimer des contacts",
};

/**
 * Initialise seulement le rôle administrateur lors de la création d'une entreprise
 * @param db Instance Prisma Client
 * @param userId ID de l'utilisateur à qui assigner le rôle admin
 */
export async function initAdminRole(db: PrismaClient, userId: string) {
	console.log("🔐 Initialisation du rôle administrateur...");

	try {
		// 1. Créer toutes les permissions nécessaires
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

		// 2. Créer uniquement le rôle administrateur
		console.log("👑 Création du rôle administrateur...");

		const adminRole = await db.role.upsert({
			where: { name: SYSTEM_ROLES.ADMIN },
			update: {
				displayName: "Administrateur",
				description: "Accès complet à toutes les fonctionnalités",
			},
			create: {
				name: SYSTEM_ROLES.ADMIN,
				displayName: "Administrateur",
				description: "Accès complet à toutes les fonctionnalités",
				isSystem: true,
			},
		});

		// 3. Associer toutes les permissions au rôle admin
		console.log("🔗 Association des permissions au rôle administrateur...");

		// Supprimer les anciennes associations
		await db.rolePermission.deleteMany({
			where: { roleId: adminRole.id },
		});

		// Créer les nouvelles associations avec toutes les permissions admin
		const adminPermissions = DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.ADMIN];
		for (const permissionType of adminPermissions) {
			const permission = await db.permission.findUnique({
				where: { type: permissionType },
			});

			if (permission) {
				await db.rolePermission.create({
					data: {
						roleId: adminRole.id,
						permissionId: permission.id,
					},
				});
			}
		}

		console.log(
			`  ✅ ${adminPermissions.length} permissions assignées au rôle administrateur`
		);

		// 4. Assigner le rôle admin à l'utilisateur
		const member = await db.member.upsert({
			where: { userId },
			update: {},
			create: { userId },
		});

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

		console.log("👑 Rôle administrateur assigné à l'utilisateur");
		console.log(
			"✅ Initialisation du rôle administrateur terminée avec succès !"
		);
		return true;
	} catch (error) {
		console.error(
			"❌ Erreur lors de l'initialisation du rôle administrateur :",
			error
		);
		throw error;
	}
}

/**
 * Initialise tous les rôles et permissions dans la base de données (pour script complet)
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
