import { SortOrder } from "@/shared/types";

export interface SortOption {
	label: string; // Libellé affiché à l'utilisateur
	value: string; // Valeur passée à l'API
}

export interface SortSelectorProps {
	options: SortOption[]; // Options de tri disponibles
	paramName?: string; // Nom du paramètre d'URL pour le tri (sortBy par défaut)
	orderParamName?: string; // Nom du paramètre d'URL pour l'ordre (sortOrder par défaut)
	defaultValue?: string; // Valeur par défaut
	defaultOrder?: SortOrder; // Ordre par défaut
	className?: string; // Classes CSS additionnelles
}
