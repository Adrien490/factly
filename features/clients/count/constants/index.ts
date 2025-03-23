import { Prisma } from "@prisma/client";

/**
 * Constantes pour le comptage des clients
 * VERSION MINIMALISTE pour comptage uniquement
 */
export const COUNT_SELECT = {
	id: true,
} as const satisfies Prisma.ClientSelect;
