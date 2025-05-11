import { ADDRESS_TYPES } from "@/domains/address/constants";
import { getClient } from "@/domains/client/features/get-client";
import { ContentCard } from "@/shared/components/content-card";
import { Button } from "@/shared/components/ui/button";
import { Country } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, FileText, MapPin } from "lucide-react";
import Link from "next/link";
import NotFound from "../../not-found";

type Props = {
	params: Promise<{
		organizationId: string;
		clientId: string;
	}>;
};

export default async function ClientPage({ params }: Props) {
	const { organizationId, clientId } = await params;

	const client = await getClient({ id: clientId, organizationId });

	if (!client) {
		return <NotFound />;
	}

	const isCompany = client.clientType === "COMPANY";

	return (
		<div className="space-y-6">
			{/* Conteneur principal à deux colonnes */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Colonne principale (2/3) */}
				<div className="lg:col-span-2 space-y-6">
					{/* Informations essentielles */}
					<ContentCard
						title={
							isCompany
								? "Informations de l'entreprise"
								: "Informations du client"
						}
						description="Détails du client"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Informations de contact */}
							<div className="space-y-4">
								<div>
									<h3 className="text-sm font-semibold mb-2">Coordonnées</h3>
									<ul className="space-y-3">
										{client.contacts[0]?.email && (
											<li className="flex items-start gap-3">
												<div>
													<p className="text-xs text-muted-foreground">Email</p>
													<a
														href={`mailto:${client.contacts[0].email}`}
														className="text-sm hover:underline"
													>
														{client.contacts[0].email}
													</a>
												</div>
											</li>
										)}

										{client.contacts[0]?.phoneNumber && (
											<li className="flex items-start gap-3">
												<div>
													<p className="text-xs text-muted-foreground">
														Téléphone
													</p>
													<a
														href={`tel:${client.contacts[0].phoneNumber}`}
														className="text-sm hover:underline"
													>
														{client.contacts[0].phoneNumber}
													</a>
												</div>
											</li>
										)}

										{client.contacts[0]?.website && (
											<li className="flex items-start gap-3">
												<div>
													<p className="text-xs text-muted-foreground">
														Site web
													</p>
													<a
														href={client.contacts[0].website}
														target="_blank"
														rel="noopener noreferrer"
														className="text-sm hover:underline"
													>
														{client.contacts[0].website.replace(
															/^https?:\/\/(www\.)?/,
															""
														)}
													</a>
												</div>
											</li>
										)}

										{client.createdAt && (
											<li className="flex items-start gap-3">
												<Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-xs text-muted-foreground">
														Client depuis
													</p>
													<p className="text-sm">
														{format(new Date(client.createdAt), "d MMMM yyyy", {
															locale: fr,
														})}
													</p>
												</div>
											</li>
										)}
									</ul>
								</div>
							</div>

							{/* Informations spécifiques selon le type de client */}
							<div className="space-y-4">
								{isCompany ? (
									<>
										<div>
											<h3 className="text-sm font-semibold mb-2">
												Informations légales
											</h3>
											<ul className="space-y-3">
												{client.company?.siren && (
													<li className="flex items-start gap-3">
														<FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
														<div>
															<p className="text-xs text-muted-foreground">
																SIREN
															</p>
															<p className="text-sm">{client.company.siren}</p>
														</div>
													</li>
												)}

												{client.company?.siret && (
													<li className="flex items-start gap-3">
														<FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
														<div>
															<p className="text-xs text-muted-foreground">
																SIRET
															</p>
															<p className="text-sm">{client.company.siret}</p>
														</div>
													</li>
												)}

												{client.company?.vatNumber && (
													<li className="flex items-start gap-3">
														<div>
															<p className="text-xs text-muted-foreground">
																TVA
															</p>
															<p className="text-sm">
																{client.company.vatNumber}
															</p>
														</div>
													</li>
												)}

												{!client.company?.siren &&
													!client.company?.siret &&
													!client.company?.vatNumber && (
														<li className="text-muted-foreground text-sm">
															Aucune information légale renseignée
														</li>
													)}
											</ul>
										</div>
									</>
								) : (
									<div>
										<h3 className="text-sm font-semibold mb-2">
											Informations personnelles
										</h3>
										<ul className="space-y-3">
											<li className="flex items-start gap-3">
												<div>
													<p className="text-xs text-muted-foreground">
														Nom complet
													</p>
													<p className="text-sm">
														{client.contacts[0]?.firstName}{" "}
														{client.contacts[0]?.lastName}
													</p>
												</div>
											</li>
											{client.contacts[0]?.function && (
												<li className="flex items-start gap-3">
													<div>
														<p className="text-xs text-muted-foreground">
															Fonction
														</p>
														<p className="text-sm">
															{client.contacts[0].function}
														</p>
													</div>
												</li>
											)}
										</ul>
									</div>
								)}
							</div>
						</div>

						{/* Notes du client si présentes */}
						{client.notes && (
							<div className="mt-6 pt-6 border-t border-dashed border-gray-200 dark:border-gray-800">
								<div className="flex items-start gap-2">
									<div>
										<h3 className="text-sm font-semibold mb-1">Notes</h3>
										<p className="text-sm text-gray-700 dark:text-gray-300">
											{client.notes}
										</p>
									</div>
								</div>
							</div>
						)}
					</ContentCard>

					{/* Adresses */}
					<ContentCard
						title="Adresses"
						description="Liste des adresses du client"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{client.addresses.map((address) => {
								const {
									id,
									addressType,
									addressLine1,
									addressLine2,
									city,
									postalCode,
									country,
									isDefault,
								} = address;

								const addressTypeLabel = ADDRESS_TYPES.find(
									(type) => type.value === addressType
								)?.label;

								return (
									<div key={id} className="p-3 border rounded-lg">
										<div className="flex items-start gap-2">
											<MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />

											<div className="min-w-0 flex-1">
												<div className="flex flex-wrap items-center gap-1.5 mb-0.5">
													<p className="text-sm font-medium">{addressLine1}</p>
													{isDefault && (
														<span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
															Par défaut
														</span>
													)}
												</div>

												{addressLine2 && (
													<p className="text-xs text-muted-foreground">
														{addressLine2}
													</p>
												)}

												<p className="text-xs text-muted-foreground mt-0.5">
													{[
														postalCode,
														city,
														country !== Country.FRANCE ? country : null,
													]
														.filter(Boolean)
														.join(", ")}
												</p>

												<p className="text-xs mt-1.5 text-muted-foreground">
													{addressTypeLabel}
												</p>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</ContentCard>
				</div>

				{/* Colonne latérale (1/3) */}
				<div className="space-y-6">
					{/* Statistiques simples */}
					<ContentCard title="Résumé" description="Aperçu des données client">
						<div className="grid grid-cols-2 gap-4 mb-4">
							<div className="bg-muted/40 rounded-lg p-4 flex flex-col items-center justify-center">
								<span className="text-2xl font-bold">
									{client.addresses.length || 0}
								</span>
								<span className="text-xs text-muted-foreground mt-1">
									Adresses
								</span>
							</div>
							<div className="bg-muted/40 rounded-lg p-4 flex flex-col items-center justify-center">
								<span className="text-xs text-muted-foreground mb-1">
									Dernière mise à jour
								</span>
								<span className="text-sm font-medium text-center">
									{client.updatedAt
										? format(new Date(client.updatedAt), "dd/MM/yyyy", {
												locale: fr,
											})
										: "Jamais"}
								</span>
							</div>
						</div>
					</ContentCard>

					{/* Actions rapides */}
					<ContentCard
						title="Actions rapides"
						description="Actions disponibles pour ce client"
					>
						<div className="space-y-2">
							<Button
								asChild
								variant="secondary"
								className="w-full justify-start"
							>
								<Link
									href={`/dashboard/${organizationId}/clients/${clientId}/addresses/new`}
								>
									<MapPin className="h-4 w-4 mr-2" />
									Ajouter une adresse
								</Link>
							</Button>
						</div>
					</ContentCard>
				</div>
			</div>
		</div>
	);
}
