import {
	Civility,
	ClientPriority,
	ClientStatus,
	ClientType,
} from "@prisma/client";
import { z } from "zod";

// Définir les types de valeurs possibles pour les filtres
const filterValueSchema = z.union([
	// Valeurs uniques (chaînes)
	z.nativeEnum(ClientStatus),
	z.nativeEnum(ClientType),
	z.nativeEnum(ClientPriority),
	z.nativeEnum(Civility),
	z.string(),

	// Tableaux de valeurs
	z.array(z.nativeEnum(ClientStatus)),
	z.array(z.nativeEnum(ClientType)),
	z.array(z.nativeEnum(ClientPriority)),
	z.array(z.nativeEnum(Civility)),
	z.array(z.string()),
]);

// Le schéma accepte désormais des enregistrements dont les valeurs
// peuvent être soit des valeurs uniques, soit des tableaux
const clientFiltersSchema = z.record(filterValueSchema);

export default clientFiltersSchema;
