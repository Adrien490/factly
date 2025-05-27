import { z } from "zod";

/**
 * Schéma de validation pour les champs de tri des membres
 */
export const memberSortBySchema = z.enum(["createdAt", "user"] as const);
