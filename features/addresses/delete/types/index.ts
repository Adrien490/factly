import { z } from "zod";
import { deleteAddressSchema } from "../schemas";

// Types pour la suppression d'une adresse
export type DeleteAddressParams = z.infer<typeof deleteAddressSchema>;
export type DeleteAddressReturn = { success: boolean; message: string };
