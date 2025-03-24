import { cn } from "@/shared/lib/utils";
import { ClientListColumnDef } from "./types";

/**
 * Styles des cellules en fonction des propriétés de la colonne
 */
export const cellStyles = <T>(column: ClientListColumnDef<T>) =>
	cn(
		"whitespace-nowrap",
		column.align === "center" && "text-center",
		column.align === "right" && "text-right",
		column.visibility === "tablet" && "hidden md:table-cell",
		column.visibility === "desktop" && "hidden lg:table-cell"
	);
