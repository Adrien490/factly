import { SupplierStatus } from "@prisma/client";
import { z } from "zod";

export const supplierStatusSchema = z.preprocess((val) => {
	// Si c'est un tableau, filtrer les valeurs valides
	if (Array.isArray(val)) {
		return val.filter(
			(status) =>
				typeof status === "string" &&
				Object.values(SupplierStatus).includes(status as SupplierStatus)
		);
	}

	// Si c'est une chaîne simple, vérifier qu'elle est valide
	if (
		typeof val === "string" &&
		Object.values(SupplierStatus).includes(val as SupplierStatus)
	) {
		return val;
	}

	// Par défaut, retourner les statuts actifs (sans ARCHIVED)
	return Object.values(SupplierStatus).filter(
		(status) => status !== "ARCHIVED"
	);
}, z.union([z.nativeEnum(SupplierStatus), z.array(z.nativeEnum(SupplierStatus))]));
