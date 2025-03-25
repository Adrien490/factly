import { cn } from "@/shared/lib/utils";

export const cellStyles = (visibility?: string) =>
	cn(
		"whitespace-nowrap",
		visibility === "tablet" && "hidden md:table-cell",
		visibility === "desktop" && "hidden lg:table-cell"
	);

export const headerStyles = (visibility?: string) => {
	return cn(
		"whitespace-nowrap",
		visibility === "tablet" && "hidden md:table-cell",
		visibility === "desktop" && "hidden lg:table-cell"
	);
};
