import { ProductStatus } from "@prisma/client";
import { z } from "zod";

export const productStatusSchema = z.preprocess((val) => {
	// Si c'est un tableau, filtrer les valeurs valides
	if (Array.isArray(val)) {
		return val.filter(
			(status) =>
				typeof status === "string" &&
				Object.values(ProductStatus).includes(status as ProductStatus)
		);
	}

	// Si c'est une chaîne simple, vérifier qu'elle est valide
	if (
		typeof val === "string" &&
		Object.values(ProductStatus).includes(val as ProductStatus)
	) {
		return val;
	}

	// Par défaut, retourner les statuts actifs (sans ARCHIVED)
	return Object.values(ProductStatus).filter(
		(status) => status !== ProductStatus.ARCHIVED
	);
}, z.union([z.nativeEnum(ProductStatus), z.array(z.nativeEnum(ProductStatus))]));
