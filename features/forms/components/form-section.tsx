import { cn } from "@/lib/utils";
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
		<section
			className={cn(
				"relative border border-border/50 rounded-lg p-6 mb-8 transition-all",
				"bg-background shadow-sm hover:shadow-md hover:border-border/70",
				className
			)}
		>
			{/* En-tête de section */}
			<div className="mb-6 pb-4 border-b border-border/30">
				<div className="flex items-start gap-4">
					{/* Icône avec effet de fond */}
					<div className="rounded-lg bg-primary/5 p-3 text-primary shadow-sm">
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
		</section>
	);
}
