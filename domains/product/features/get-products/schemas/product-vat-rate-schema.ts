import { VatRate } from "@prisma/client";
import { z } from "zod";

export const productVatRateSchema = z.preprocess((val) => {
	// Si c'est un tableau, filtrer les valeurs valides
	if (Array.isArray(val)) {
		return val.filter(
			(vatRate) =>
				typeof vatRate === "string" &&
				Object.values(VatRate).includes(vatRate as VatRate)
		);
	}

	// Si c'est une chaîne simple, vérifier qu'elle est valide
	if (
		typeof val === "string" &&
		Object.values(VatRate).includes(val as VatRate)
	) {
		return val;
	}

	// Par défaut, retourner tous les taux de TVA
	return Object.values(VatRate);
}, z.union([z.nativeEnum(VatRate), z.array(z.nativeEnum(VatRate))]));
