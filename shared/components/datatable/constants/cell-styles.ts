import { cn } from "@/shared/lib/utils";
import { ColumnDef } from "../types";

export const cellStyles = <T>(column: ColumnDef<T>) =>
	cn(
		"whitespace-nowrap",
		column.align === "center" && "text-center",
		column.align === "right" && "text-right",
		column.visibility === "tablet" && "hidden md:table-cell",
		column.visibility === "desktop" && "hidden lg:table-cell"
	);
