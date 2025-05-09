import { Card, CardContent, CardHeader } from "@/shared/components/";
import { cn } from "@/shared/utils";
import { FormCardProps } from "./types";

/**
 * Section de formulaire avec design raffiné et structure visuelle claire
 * Mise en page optimisée pour une meilleure lisibilité et hiérarchie visuelle
 */
export function FormCard({
	title,
	description,
	icon: Icon,
	children,
	className = "",
}: FormCardProps) {
	return (
		<Card className={cn("", className)}>
			<CardHeader>
				<div className="flex items-center gap-3 pb-2">
					<Icon className="h-5 w-5 text-primary" />
					<div>
						<h3 className="text-base font-semibold">{title}</h3>
						{description && (
							<p className="text-sm text-muted-foreground">{description}</p>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}
