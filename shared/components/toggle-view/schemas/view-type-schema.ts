import { z } from "zod";

/**
 * Schéma de validation pour le type de vue
 * Valide que la vue est soit "grid" soit "list"
 */
export const viewTypeSchema = z.enum(["grid", "list"] as const).default("grid");
