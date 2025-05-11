import { Card, CardContent, CardHeader } from "@/shared/components/";
import { cn } from "@/shared/utils";
import { ReactNode } from "react";

/**
 * Section de formulaire avec design raffiné et structure visuelle claire
 * Mise en page optimisée pour une meilleure lisibilité et hiérarchie visuelle
 *
 *
 */
interface ContentCardProps {
	title: string;
	description?: string;
	children: ReactNode;
	className?: string;
}
export function ContentCard({
	title,
	description,
	children,
	className = "",
}: ContentCardProps) {
	return (
		<Card className={cn("", className)}>
			<CardHeader>
				<div className="flex items-center gap-3 pb-2">
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
