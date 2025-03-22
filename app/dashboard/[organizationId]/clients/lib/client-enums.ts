"use client";

import { Civility, ClientType } from "@prisma/client";

export const SORTABLE_FIELDS = [
	"name",
	"createdAt",
	"status",
	"email",
	"reference",
] as ["name", "createdAt", "status", "email", "reference"];

export const CLIENT_TYPE: Record<ClientType, string> = {
	COMPANY: "Entreprise",
	INDIVIDUAL: "Particulier",
} as const;

export const CIVILITY: Record<Civility, string> = {
	MR: "Monsieur",
	MRS: "Madame",
	MS: "Mademoiselle",
	DR: "Docteur",
	PROF: "Professeur",
	MASTER: "Maître",
} as const;
