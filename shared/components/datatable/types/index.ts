import { SortingParams } from "../../sorting-dropdown/types";
import { PaginationParams } from "../components/pagination/schemas";

export type DataTableParams<T extends [string, ...string[]]> =
	PaginationParams & SortingParams<T>;

export interface DataTableProps<T extends { id: string }> {
	data: T[];
	columns: ColumnDef<T>[];
	selection?: {
		key: string;
		actions?: React.ReactNode;
	};
	getItemId?: (item: T) => string;
	pagination?: {
		total: number;
		pageCount: number;
		page: number;
		perPage: number;
	};
	ariaLabel?: string;

	// Configuration pour les lignes collapsibles
	collapsible?: {
		key?: string; // Clé pour les paramètres d'URL (par défaut: "expanded")
		content: (item: T) => React.ReactNode; // Contenu à afficher quand la ligne est étendue
		initialExpandedIds?: string[]; // IDs des lignes initialement étendues
	};
}

// Type d'action pour les lignes du tableau

export interface ColumnDef<T> {
	id: string;
	header: string | (() => React.ReactNode);
	cell: (item: T) => React.ReactNode;
	visibility?: "always" | "tablet" | "desktop";
	align?: "left" | "center" | "right";
	sortable?: boolean;
	// Styles spécifiques pour la colonne (pertinent)
	className?: string;
}
