import { z } from "zod";
import { viewTypeSchema } from "../schemas";

/**
 * Représente les types de vue disponibles dans l'application
 */
export type ViewType = z.infer<typeof viewTypeSchema>;
