"use client";

import { Civility, ClientStatus, ClientType, LegalForm } from "@prisma/client";

// Définition de FilterFieldProps si le module n'existe pas
interface FilterFieldProps {
	type: string;
	name: string;
	label: string;
	options?: Array<{ label: string; value: string }>;
	placeholder?: string;
}

export const CLIENT_STATUS: Record<ClientStatus, string> = {
	LEAD: "Prospect non qualifié",
	PROSPECT: "Prospect qualifié",
	ACTIVE: "Client actif",
	INACTIVE: "Client inactif",
	ARCHIVED: "Client archivé",
} as const;

export const SORTABLE_FIELDS = [
	"name",
	"createdAt",
	"status",
	"email",
	"reference",
] as ["name", "createdAt", "status", "email", "reference"];

export const CLIENT_LEGAL_FORMS: Record<LegalForm, string> = {
	EI: "Entreprise Individuelle",
	EIRL: "EIRL",
	EURL: "EURL",
	SARL: "SARL",
	SAS: "SAS",
	SASU: "SASU",
	SA: "SA",
	SCI: "SCI",
	SNC: "SNC",
	SCOP: "Société Coopérative et Participative",
	ASSO: "Association loi 1901",
	AE: "Auto-Entrepreneur",
	ME: "Micro-Entreprise",
	OTHER: "Autre forme juridique",
} as const;

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

export const CLIENT_FILTERS: FilterFieldProps[] = [
	{
		type: "select",
		name: "status",
		label: "Statut",
		options: Object.entries(CLIENT_STATUS).map(([value, label]) => ({
			label,
			value,
		})),
	},
	{
		type: "select",
		name: "clientType",
		label: "Type",
		options: Object.values(ClientType).map((type) => ({
			label: type === "COMPANY" ? "Entreprise" : "Particulier",
			value: type,
		})),
	},
	{
		type: "select",
		name: "civility",
		label: "Civilité",
		options: Object.entries(CIVILITY).map(([value, label]) => ({
			label,
			value,
		})),
	},
	{
		type: "text",
		name: "zipCode",
		label: "Code postal",
		placeholder: "75001",
	},
] as const;
