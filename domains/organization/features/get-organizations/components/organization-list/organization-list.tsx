import { Card, CardContent } from "@/shared/components";
import { cn } from "@/shared/utils";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { ActionMenu } from "./components";
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
				{organizations.map((organization) => {
					const { id, slug, company, address } = organization;
					const initial = slug.charAt(0).toUpperCase();
					if (viewType === "list") {
						return (
							<Link key={id} href={`/dashboard/${id}`} className="block">
								<div className="border rounded-lg p-3 transition-all duration-200 hover:border-primary/50 hover:bg-accent/30">
									<div className="flex items-center gap-3">
										{/* Logo */}
										<div className="h-10 w-10 shrink-0 flex items-center justify-center">
											{company?.logoUrl ? (
												<div className="h-10 w-10 relative rounded-md overflow-hidden">
													<Image
														src={company.logoUrl}
														alt={company.companyName}
														fill
														sizes="40px"
														className="object-cover"
													/>
												</div>
											) : (
												<div className="h-10 w-10 rounded-md bg-muted/50 flex items-center justify-center">
													<span className="text-base font-medium text-muted-foreground">
														{initial}
													</span>
												</div>
											)}
										</div>

										{/* Nom et détails */}
										<div className="min-w-0 flex-1">
											<h3 className="font-medium truncate">
												{company?.companyName}
											</h3>
											<p className="text-xs text-muted-foreground truncate">
												{company?.legalForm && <span>{company.legalForm}</span>}
												{company?.legalForm && address?.city && (
													<span> · </span>
												)}
												{address?.city && <span>{address.city}</span>}
											</p>
										</div>

										{/* Menu d'actions */}
										<ActionMenu id={id} />
									</div>
								</div>
							</Link>
						);
					}

					// Rendu en mode grille
					return (
						<Link key={id} href={`/dashboard/${id}`} className="block h-full">
							<Card className="h-full transition-all duration-200 hover:border-primary/50 hover:bg-accent/30 p-4">
								<CardContent className="flex flex-col h-full">
									<div className="flex items-start gap-3">
										{/* Logo */}
										<div className="h-12 w-12 shrink-0 flex items-center justify-center">
											{company?.logoUrl ? (
												<div className="h-12 w-12 relative rounded-md overflow-hidden">
													<Image
														src={company.logoUrl}
														alt={company.companyName}
														fill
														sizes="48px"
														className="object-cover"
													/>
												</div>
											) : (
												<div className="h-12 w-12 rounded-md bg-muted/50 flex items-center justify-center">
													<span className="text-lg font-medium text-muted-foreground">
														{initial}
													</span>
												</div>
											)}
										</div>

										{/* Nom et sous-titre */}
										<div className="flex-1 min-w-0">
											<h3 className="font-medium truncate">
												{company?.companyName}
											</h3>
											{company?.legalForm &&
												company?.legalForm !== company?.companyName && (
													<p className="text-xs text-muted-foreground truncate mt-0.5">
														{company?.legalForm}
													</p>
												)}
										</div>

										{/* Menu d'actions */}
										<ActionMenu id={id} />
									</div>

									{/* Informations secondaires */}
									<div className="pt-3 text-xs text-muted-foreground flex flex-wrap gap-x-2 gap-y-1 mt-2">
										{company?.legalForm && <span>{company?.legalForm}</span>}
										{address?.city && <span>{address?.city}</span>}
									</div>
								</CardContent>
							</Card>
						</Link>
					);
				})}
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
