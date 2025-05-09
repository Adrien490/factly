"use client";

import { Skeleton } from "@/shared/components";
import { FormCard, FormLayout } from "@/shared/components/forms";
import { Building, Clock, Receipt, Tag, User } from "lucide-react";

export function UpdateClientFormSkeleton() {
	return (
		<div className="animate-pulse space-y-6">
			{/* Corps du formulaire */}
			<div className="space-y-6">
				<FormLayout withDividers columns={2}>
					{/* Section 1: Informations de base */}
					<FormCard
						title="Informations de base"
						description="Renseignez les informations principales du client"
						icon={Building}
					>
						<div className="space-y-4">
							{/* Champ Référence */}
							<div className="space-y-1.5">
								<div className="flex justify-between items-center">
									<Skeleton className="h-5 w-28" />
									<Skeleton className="h-6 w-20" />
								</div>
								<Skeleton className="h-10 w-full" />
							</div>

							{/* Champ Nom */}
							<div className="space-y-1.5">
								<Skeleton className="h-5 w-40" />
								<Skeleton className="h-10 w-full" />
							</div>

							{/* Champ Type de client */}
							<div className="space-y-1.5">
								<Skeleton className="h-5 w-36" />
								<Skeleton className="h-10 w-full" />
							</div>

							{/* Champ Statut */}
							<div className="space-y-1.5">
								<Skeleton className="h-5 w-20" />
								<Skeleton className="h-10 w-full" />
							</div>
						</div>
					</FormCard>

					{/* Section 2: Coordonnées */}
					<FormCard
						title="Coordonnées"
						description="Coordonnées du client"
						icon={User}
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
					</FormCard>

					{/* Section 3: Informations fiscales */}
					<FormCard
						title="Informations fiscales"
						description="Informations légales et fiscales"
						icon={Receipt}
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
					</FormCard>

					{/* Section 4: Notes et commentaires */}
					<FormCard
						title="Notes"
						description="Informations supplémentaires"
						icon={Tag}
					>
						<div className="space-y-4">
							{/* Champ Notes */}
							<div className="space-y-1.5">
								<Skeleton className="h-5 w-20" />
								<Skeleton className="h-32 w-full" />
							</div>
						</div>
					</FormCard>

					{/* Section 5: Informations de facturation */}
					<FormCard
						title="Informations de facturation"
						description="Modalités de facturation"
						icon={Clock}
						className="col-span-2"
					>
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Champ Délai de paiement */}
								<div className="space-y-1.5">
									<Skeleton className="h-5 w-40" />
									<Skeleton className="h-10 w-full" />
								</div>

								{/* Champ Méthode de paiement */}
								<div className="space-y-1.5">
									<Skeleton className="h-5 w-40" />
									<Skeleton className="h-10 w-full" />
								</div>
							</div>
						</div>
					</FormCard>
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
