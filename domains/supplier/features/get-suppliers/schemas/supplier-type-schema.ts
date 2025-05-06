import { SupplierType } from "@prisma/client";
import { z } from "zod";

export const supplierTypeSchema = z.preprocess((val) => {
	// Si c'est un tableau, filtrer les valeurs valides
	if (Array.isArray(val)) {
		return val.filter(
			(type) =>
				typeof type === "string" &&
				Object.values(SupplierType).includes(type as SupplierType)
		);
	}

	// Si c'est une chaîne simple, vérifier qu'elle est valide
	if (
		typeof val === "string" &&
		Object.values(SupplierType).includes(val as SupplierType)
	) {
		return val;
	}

	// Par défaut, retourner tous les types de fournisseur
	return Object.values(SupplierType);
}, z.union([z.nativeEnum(SupplierType), z.array(z.nativeEnum(SupplierType))]));
