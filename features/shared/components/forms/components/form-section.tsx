import { Card } from "@/features/shared/components/ui/card";
import { cn } from "@/features/shared/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface FormSectionProps {
	title: string;
	description: string;
	icon: LucideIcon;
	children: ReactNode;
	className?: string;
}

/**
 * Section de formulaire avec design raffiné et structure visuelle claire
 * Mise en page optimisée pour une meilleure lisibilité et hiérarchie visuelle
 */
export function FormSection({
	title,
	description,
	icon: Icon,
	children,
	className = "",
}: FormSectionProps) {
	return (
		<Card
			className={cn(
				"relative rounded-lg p-6 mb-8 transition-all",

				className
			)}
		>
			{/* En-tête de section */}
			<div className="mb-6 pb-4 border-b border-border/30">
				<div className="flex items-start gap-4">
					{/* Icône avec effet de fond */}
					<div className="py-2 px-3 text-primary">
						<Icon className="h-5 w-5" />
					</div>

					{/* Titre et description avec meilleure hiérarchie */}
					<div className="flex-1 pt-1">
						<h3 className="text-base font-semibold tracking-tight">{title}</h3>
						{description && (
							<p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-prose">
								{description}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Contenu de la section avec meilleur espacement */}
			<div className="space-y-5 px-1">{children}</div>
		</Card>
	);
}
