import { ClientStatus } from "@prisma/client";
import { z } from "zod";

export const clientStatusSchema = z.preprocess((val) => {
	// Si c'est un tableau, filtrer les valeurs valides
	if (Array.isArray(val)) {
		return val.filter(
			(status) =>
				typeof status === "string" &&
				Object.values(ClientStatus).includes(status as ClientStatus)
		);
	}

	// Si c'est une chaîne simple, vérifier qu'elle est valide
	if (
		typeof val === "string" &&
		Object.values(ClientStatus).includes(val as ClientStatus)
	) {
		return val;
	}

	// Par défaut, retourner les statuts actifs (sans ARCHIVED)
	return Object.values(ClientStatus).filter((status) => status !== "ARCHIVED");
}, z.union([z.nativeEnum(ClientStatus), z.array(z.nativeEnum(ClientStatus))]));
