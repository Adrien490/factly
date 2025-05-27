import { getClient } from "@/domains/client/features/get-client";
import { ContentCard } from "@/shared/components/content-card";
import { Country } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import NotFound from "../../not-found";

type Props = {
	params: Promise<{
		clientId: string;
	}>;
};

export default async function ClientPage({ params }: Props) {
	const { clientId } = await params;

	const client = await getClient({ id: clientId });

	if (!client) {
		return <NotFound />;
	}

	const isCompany = client.type === "COMPANY";

	return (
		<div className="space-y-6">
			{/* En-tête avec informations principales */}

			{/* Conteneur principal à deux colonnes */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Colonne principale (2/3) */}
				<div className="lg:col-span-2 space-y-6">
					{/* Informations essentielles */}
					<ContentCard
						title={
							isCompany
								? "Informations de l'entreprise"
								: "Informations du contact"
						}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Informations de contact */}
							<div className="space-y-4">
								<div>
									<h3 className="text-sm font-semibold mb-2">Coordonnées</h3>
									<ul className="space-y-3">
										{client.contacts[0]?.email && (
											<li>
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
											<li>
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
											<li>
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
									</ul>
								</div>
							</div>

							{/* Informations spécifiques selon le type de client */}
							<div className="space-y-4">
								{isCompany ? (
									<div>
										<h3 className="text-sm font-semibold mb-2">
											Informations légales
										</h3>
										<ul className="space-y-3">
											{client.company?.siren && (
												<li>
													<div>
														<p className="text-xs text-muted-foreground">
															SIREN
														</p>
														<p className="text-sm">{client.company.siren}</p>
													</div>
												</li>
											)}

											{client.company?.siret && (
												<li>
													<div>
														<p className="text-xs text-muted-foreground">
															SIRET
														</p>
														<p className="text-sm">{client.company.siret}</p>
													</div>
												</li>
											)}

											{client.company?.vatNumber && (
												<li>
													<div>
														<p className="text-xs text-muted-foreground">TVA</p>
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
								) : (
									<div>
										<h3 className="text-sm font-semibold mb-2">
											Informations personnelles
										</h3>
										<ul className="space-y-3">
											<li>
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
												<li>
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
					</ContentCard>

					{/* Adresses */}
					<ContentCard title="Adresses">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{/* Adresse de facturation */}
							{client.addresses.find(
								(address) =>
									address.isDefault && address.addressType === "BILLING"
							) ? (
								<div className="p-3 border rounded-lg">
									<div>
										<h3 className="text-sm font-semibold mb-2">
											Adresse de facturation
										</h3>
										<div className="space-y-1">
											{(() => {
												const address = client.addresses.find(
													(addr) =>
														addr.isDefault && addr.addressType === "BILLING"
												);
												return (
													<>
														<p className="text-sm font-medium">
															{address?.addressLine1}
														</p>
														{address?.addressLine2 && (
															<p className="text-sm text-muted-foreground">
																{address.addressLine2}
															</p>
														)}
														<p className="text-sm text-muted-foreground">
															{[
																address?.postalCode,
																address?.city,
																address?.country !== Country.FRANCE
																	? address?.country
																	: null,
															]
																.filter(Boolean)
																.join(", ")}
														</p>
													</>
												);
											})()}
										</div>
									</div>
								</div>
							) : null}

							{/* Adresse de livraison */}
							{client.addresses.find(
								(address) =>
									address.isDefault && address.addressType === "SHIPPING"
							) ? (
								<div className="p-3 border rounded-lg">
									<div>
										<h3 className="text-sm font-semibold mb-2">
											Adresse de livraison
										</h3>
										<div className="space-y-1">
											{(() => {
												const address = client.addresses.find(
													(addr) =>
														addr.isDefault && addr.addressType === "SHIPPING"
												);
												return (
													<>
														<p className="text-sm font-medium">
															{address?.addressLine1}
														</p>
														{address?.addressLine2 && (
															<p className="text-sm text-muted-foreground">
																{address.addressLine2}
															</p>
														)}
														<p className="text-sm text-muted-foreground">
															{[
																address?.postalCode,
																address?.city,
																address?.country !== Country.FRANCE
																	? address?.country
																	: null,
															]
																.filter(Boolean)
																.join(", ")}
														</p>
													</>
												);
											})()}
										</div>
									</div>
								</div>
							) : null}

							{/* Message si aucune adresse par défaut */}
							{!client.addresses.find(
								(address) =>
									address.isDefault &&
									(address.addressType === "BILLING" ||
										address.addressType === "SHIPPING")
							) && (
								<div className="col-span-2 text-center text-muted-foreground">
									Aucune adresse de facturation ou de livraison définie
								</div>
							)}
						</div>
					</ContentCard>
				</div>

				{/* Colonne latérale (1/3) */}
				<div className="space-y-6">
					{/* Statistiques simples */}
					<ContentCard title="Résumé">
						<div className="grid grid-cols-2 gap-4">
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
									Client depuis
								</span>
								<span className="text-sm font-medium text-center">
									{client.createdAt
										? format(new Date(client.createdAt), "dd/MM/yyyy", {
												locale: fr,
											})
										: "Jamais"}
								</span>
							</div>
						</div>
					</ContentCard>
				</div>
			</div>
		</div>
	);
}
