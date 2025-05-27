import { Prisma } from "@prisma/client";

/**
 * Sélection minimale pour vérifier l'appartenance d'un utilisateur
 * Optimisée pour les performances
 */
export const CHECK_MEMBERSHIP_SELECT = {
	id: true,
	userId: true,
	createdAt: true,
} as const satisfies Prisma.MemberSelect;
