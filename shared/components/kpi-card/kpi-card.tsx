import { use } from "react";
import { cn } from "../../utils";
import { Card, CardContent } from "../ui";
import { variantStyles } from "./constants";
import { KpiCardProps } from "./types";

export function KpiCard({
	valuePromise,
	title,
	icon,
	className,
	variant = "default",
	decimalPlaces = 0,
}: KpiCardProps) {
	// Résoudre la promise avec le hook use() de React
	const value = use(valuePromise);

	// Formatter le nombre selon les préférences locales
	const formattedValue = Intl.NumberFormat("fr-FR", {
		minimumFractionDigits: decimalPlaces,
		maximumFractionDigits: decimalPlaces,
	}).format(value);

	// Styles simples pour les variantes

	return (
		<Card className="shadow-sm h-full">
			<CardContent className={cn("flex flex-col", className)}>
				<div className="flex items-center gap-2 mb-2">
					{icon && icon}
					<span className="text-sm font-medium text-muted-foreground">
						{title}
					</span>
				</div>

				<div className={cn("text-2xl font-bold", variantStyles[variant])}>
					{formattedValue}
				</div>
			</CardContent>
		</Card>
	);
}
