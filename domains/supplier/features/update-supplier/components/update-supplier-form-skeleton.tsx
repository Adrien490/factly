"use client";

import { Skeleton } from "@/shared/components";
import { FormLayout, FormSection } from "@/shared/components/forms";
import { Building, ClipboardEdit, Receipt, Tag } from "lucide-react";

export function UpdateSupplierFormSkeleton() {
	return (
		<div className="animate-pulse space-y-6">
			{/* Corps du formulaire */}
			<div className="space-y-6">
				<FormLayout withDividers columns={2} className="mt-6">
					{/* Section Information de base */}
					<FormSection
						title="Informations de base"
						description="Informations générales sur le fournisseur"
						icon={Building}
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
					</FormSection>

					{/* Section Coordonnées */}
					<FormSection
						title="Coordonnées"
						description="Informations de contact du fournisseur"
						icon={ClipboardEdit}
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
					</FormSection>

					{/* Section Informations fiscales */}
					<FormSection
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
					</FormSection>

					{/* Section Notes */}
					<FormSection
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
					</FormSection>
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
