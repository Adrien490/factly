import { cn } from "@/shared/utils";

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

export const tableRowVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: i * 0.05,
			duration: 0.3,
			ease: "easeOut",
		},
	}),
};
