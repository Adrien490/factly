import { cn } from "@/shared/utils";
import { FormLayoutProps } from "./types";

/**
 * Layout simplifié pour les formulaires avec mise en page responsive
 */
export function FormLayout({
	children,
	className = "",
	columns = 2,
	withDividers = false,
}: Omit<FormLayoutProps, "spacing"> & { spacing?: never }) {
	// Configuration simplifiée des colonnes
	const gridCols = columns === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2";

	// Dividers simplifiés
	const dividerClasses = withDividers
		? "divide-y md:divide-y-0 md:divide-x divide-border"
		: "";

	return (
		<div
			className={cn("grid gap-6 w-full", gridCols, dividerClasses, className)}
		>
			{children}
		</div>
	);
}
