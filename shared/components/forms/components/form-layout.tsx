import { cn } from "@/shared/lib/utils";
import { ReactNode } from "react";

interface FormLayoutProps {
	children: ReactNode;
	className?: string;
	columns?: 1 | 2 | 3;
	spacing?: "normal" | "compact" | "relaxed";
	withDividers?: boolean;
}

/**
 * Layout moderne pour les formulaires avec mise en page responsive optimisée
 * Assure une présentation élégante sur tous les appareils
 */
export function FormLayout({
	children,
	className = "",
	columns = 2,
	spacing = "normal",
	withDividers = false,
}: FormLayoutProps) {
	// Configuration des colonnes responsive améliorée
	const gridCols = {
		1: "grid-cols-1",
		2: "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2",
		3: "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
	};

	// Espacements raffinés pour une meilleure expérience visuelle
	const spacingClasses = {
		compact: "gap-4 md:gap-5",
		normal: "gap-5 md:gap-6 lg:gap-8",
		relaxed: "gap-6 md:gap-8 lg:gap-10",
	};

	// Dividers avec styles améliorés
	const dividerClasses = withDividers
		? "divide-y md:divide-y-0 md:divide-x divide-border/30 [&>*]:md:first:pl-0 [&>*]:md:border-l-0 [&>*]:first:pt-0 [&>*]:first:border-t-0"
		: "";

	return (
		<div
			className={cn(
				"grid transition-all w-full",
				gridCols[columns],
				spacingClasses[spacing],
				dividerClasses,
				"relative pb-4", // Padding en bas pour éviter que le footer ne chevauche
				className
			)}
		>
			{children}
		</div>
	);
}
