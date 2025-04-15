import { cn } from "@/shared/utils";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { OrganizationCard } from "./components";
import { OrganizationListProps } from "./types";

export function OrganizationList({
	viewType = "grid",
	organizationsPromise,
}: OrganizationListProps) {
	// Utilisation du hook use pour résoudre la Promise
	const organizations = use(organizationsPromise);

	return (
		<div className="relative group-has-data-pending:animate-pulse">
			{/* Animation de transition pour donner un retour visuel lorsqu'on change de vue */}
			<div
				className={cn(
					"transition-all duration-300",
					viewType === "grid"
						? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
						: "space-y-3"
				)}
			>
				{/* Mapping des organisations avec le paramètre view pour adaptation */}
				{organizations.map((organization) => (
					<OrganizationCard
						key={organization.id}
						organization={organization}
						viewType={viewType}
					/>
				))}

				{organizations.length === 0 && (
					<Link
						href="/dashboard/new"
						className={`block ${viewType === "grid" ? "h-full" : ""}`}
					>
						<div
							className={`
						border border-dashed rounded-lg flex items-center justify-center 
						text-muted-foreground hover:text-primary hover:border-primary 
						transition-colors
						${viewType === "grid" ? "h-full p-6 flex-col" : "p-4 flex-row"}
					`}
						>
							<PlusCircle
								className={
									viewType === "grid" ? "h-10 w-10 mb-2" : "h-5 w-5 mr-2"
								}
							/>
							<span>
								{viewType === "grid"
									? "Créer une organisation"
									: "Nouvelle organisation"}
							</span>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
}
