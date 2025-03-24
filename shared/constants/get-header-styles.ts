import { cn } from "../lib/utils";

export const getHeaderStyles = (visibility?: string) => {
	return cn(
		"whitespace-nowrap",
		visibility === "tablet" && "hidden md:table-cell",
		visibility === "desktop" && "hidden lg:table-cell"
	);
};
