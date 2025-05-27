import { z } from "zod";

// Schéma optionnel pour vérifier l'appartenance d'un utilisateur spécifique
export const checkMembershipSchema = z.object({
	userId: z.string().min(1, "L'ID utilisateur est requis").optional(),
});

// Schéma pour vérifier sa propre appartenance (pas de paramètres requis)
export const checkOwnMembershipSchema = z.object({});
