import { ClientType } from "@prisma/client";
import { z } from "zod";

export const clientTypeSchema = z.preprocess((val) => {
	// Si c'est un tableau, filtrer les valeurs valides
	if (Array.isArray(val)) {
		return val.filter(
			(type) =>
				typeof type === "string" &&
				Object.values(ClientType).includes(type as ClientType)
		);
	}

	// Si c'est une chaîne simple, vérifier qu'elle est valide
	if (
		typeof val === "string" &&
		Object.values(ClientType).includes(val as ClientType)
	) {
		return val;
	}

	// Par défaut, retourner tous les types de client
	return Object.values(ClientType);
}, z.union([z.nativeEnum(ClientType), z.array(z.nativeEnum(ClientType))]));
