import { cn } from "../lib/utils";

export const getCellStyles = (visibility?: string, align?: string) => {
	return cn(
		"whitespace-nowrap",
		align === "center" && "text-center",
		align === "right" && "text-right",
		visibility === "tablet" && "hidden md:table-cell",
		visibility === "desktop" && "hidden lg:table-cell"
	);
};
