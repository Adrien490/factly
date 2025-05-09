"use client";

import { Skeleton } from "@/shared/components";
import { ContentCard } from "@/shared/components/content-card";
import { FormLayout } from "@/shared/components/forms";

export function UpdateSupplierFormSkeleton() {
	return (
		<div className="animate-pulse space-y-6">
			{/* Corps du formulaire */}
			<div className="space-y-6">
				<FormLayout withDividers columns={2} className="mt-6">
					{/* Section Information de base */}
					<ContentCard
						title="Informations de base"
						description="Informations générales sur le fournisseur"
					>
						<div className="space-y-4">
							{/* Champ Nom */}
							<div className="space-y-1.5">
								<div className="flex justify-between">
									<Skeleton className="h-5 w-40" />
								</div>
								<Skeleton className="h-10 w-full" />
							</div>

							{/* Champ Raison sociale */}
							<div className="space-y-1.5">
								<Skeleton className="h-5 w-32" />
								<Skeleton className="h-10 w-full" />
							</div>

							{/* Champ Type de fournisseur */}
							<div className="space-y-1.5">
								<Skeleton className="h-5 w-44" />
								<Skeleton className="h-10 w-full" />
							</div>

							{/* Champ Statut */}
							<div className="space-y-1.5">
								<Skeleton className="h-5 w-20" />
								<Skeleton className="h-10 w-full" />
							</div>
						</div>
					</ContentCard>

					{/* Section Coordonnées */}
					<ContentCard
						title="Coordonnées"
						description="Informations de contact du fournisseur"
					>
						<div className="space-y-4">
							{/* Champ Email */}
							<div className="space-y-1.5">
								<Skeleton className="h-5 w-20" />
								<Skeleton className="h-10 w-full" />
							</div>

							{/* Champ Téléphone */}
							<div className="space-y-1.5">
								<Skeleton className="h-5 w-24" />
								<Skeleton className="h-10 w-full" />
							</div>

							{/* Champ Site web */}
							<div className="space-y-1.5">
								<Skeleton className="h-5 w-24" />
								<Skeleton className="h-10 w-full" />
							</div>
						</div>
					</ContentCard>

					{/* Section Informations fiscales */}
					<ContentCard
						title="Informations fiscales"
						description="Informations légales et fiscales"
					>
						<div className="space-y-4">
							{/* Champ SIREN */}
							<div className="space-y-1.5">
								<Skeleton className="h-5 w-20" />
								<Skeleton className="h-10 w-full" />
							</div>

							{/* Champ SIRET */}
							<div className="space-y-1.5">
								<Skeleton className="h-5 w-20" />
								<Skeleton className="h-10 w-full" />
							</div>

							{/* Champ Numéro de TVA */}
							<div className="space-y-1.5">
								<Skeleton className="h-5 w-32" />
								<Skeleton className="h-10 w-full" />
							</div>
						</div>
					</ContentCard>

					{/* Section Notes */}
					<ContentCard title="Notes" description="Informations supplémentaires">
						<div className="space-y-4">
							{/* Champ Notes */}
							<div className="space-y-1.5">
								<Skeleton className="h-5 w-20" />
								<Skeleton className="h-32 w-full" />
							</div>
						</div>
					</ContentCard>
				</FormLayout>

				{/* Boutons d'action */}
				<div className="flex items-center justify-between pt-6">
					<Skeleton className="h-10 w-24" />
					<Skeleton className="h-10 w-48" />
				</div>
			</div>
		</div>
	);
}
