import { Civility, ClientStatus, ClientType, LegalForm } from "@prisma/client";
import { FilterFieldProps } from "../../../../../components/filter-field";

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
	AUTO_ENTREPRENEUR: "Auto-entrepreneur",
	EI: "Entreprise Individuelle",
	EIRL: "EIRL",
	EURL: "EURL",
	SARL: "SARL",
	SAS: "SAS",
	SASU: "SASU",
	SA: "SA",
	SCI: "SCI",
	SCM: "SCM",
	SNC: "SNC",
	ASSOCIATION: "Association",
	AUTRE: "Autre",
} as const;

export const CIVILITY: Record<Civility, string> = {
	M: "Monsieur",
	Mme: "Madame",
	Mlle: "Mademoiselle",
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

export const CLIENT_TYPE: Record<ClientType, string> = {
	COMPANY: "Entreprise",
	INDIVIDUAL: "Particulier",
} as const;
