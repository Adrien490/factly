import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface NotFoundAction {
	label: string;
	href: string;
	icon?: React.ReactNode;
	variant?: "default" | "outline" | "ghost";
}

interface NotFoundProps {
	title?: string;
	description?: string;
	/** Code d'erreur à afficher */
	errorCode?: string | number;
	/** Actions à afficher (boutons) */
	actions?: NotFoundAction[];
	/** Classes CSS additionnelles pour le conteneur */
	className?: string;
	/** Classes CSS additionnelles pour le conteneur du contenu */
	contentClassName?: string;
}

export function NotFound({
	title = "Page introuvable",
	description = "Désolé, nous n'avons pas trouvé la page que vous recherchez.",
	errorCode = "404",
	actions = [
		{
			label: "Retour",
			href: "/",
			icon: <ArrowLeft className="size-4" />,
			variant: "outline",
		},
		{
			label: "Tableau de bord",
			href: "/dashboard",
			icon: <Home className="size-4" />,
		},
	],
	className,
	contentClassName,
}: NotFoundProps) {
	return (
		<PageContainer
			className={cn(
				"flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-16 sm:py-20 md:py-24",
				className
			)}
		>
			<div
				className={cn(
					"relative flex max-w-2xl flex-col items-center text-center",
					contentClassName
				)}
			>
				{/* Code d'erreur en arrière-plan */}
				<div className="absolute -top-8 select-none text-[8rem] font-bold text-muted-foreground/10 sm:-top-10 sm:text-[10rem] md:-top-12 md:text-[12rem]">
					{errorCode}
				</div>

				{/* Contenu principal */}
				<div className="relative space-y-8">
					<PageHeader
						title={title}
						description={description}
						className="items-center"
					/>

					{/* Actions */}
					{actions?.length > 0 && (
						<div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
							{actions.map((action, index) => (
								<Button
									key={index}
									asChild
									variant={action.variant ?? "default"}
									size="lg"
								>
									<Link href={action.href} className="gap-2">
										{action.icon}
										{action.label}
									</Link>
								</Button>
							))}
						</div>
					)}
				</div>

				{/* Ligne décorative */}
				<div className="absolute -bottom-16 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent sm:-bottom-20 md:-bottom-24" />
			</div>
		</PageContainer>
	);
}
