import { ADDRESS_TYPES } from "@/domains/address/constants";
import { getClient } from "@/domains/client/features/get-client";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Country } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
	Building2,
	Calendar,
	FileText,
	Globe,
	Mail,
	MapPin,
	Phone,
} from "lucide-react";
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

	return (
		<div className="space-y-6">
			{/* Conteneur principal à deux colonnes */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Colonne principale (2/3) */}
				<div className="lg:col-span-2 space-y-6">
					{/* Informations essentielles */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Informations du client</CardTitle>
							<CardDescription>
								Coordonnées et informations fiscales
							</CardDescription>
						</CardHeader>

						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div>
										<h3 className="text-sm font-semibold mb-2">Coordonnées</h3>
										<ul className="space-y-3">
											{client.email && (
												<li className="flex items-start gap-3">
													<Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">
															Email
														</p>
														<a
															href={`mailto:${client.email}`}
															className="text-sm hover:underline"
														>
															{client.email}
														</a>
													</div>
												</li>
											)}

											{client.phone && (
												<li className="flex items-start gap-3">
													<Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">
															Téléphone
														</p>
														<a
															href={`tel:${client.phone}`}
															className="text-sm hover:underline"
														>
															{client.phone}
														</a>
													</div>
												</li>
											)}

											{client.website && (
												<li className="flex items-start gap-3">
													<Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">
															Site web
														</p>
														<a
															href={client.website}
															target="_blank"
															rel="noopener noreferrer"
															className="text-sm hover:underline"
														>
															{client.website.replace(
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
															{format(
																new Date(client.createdAt),
																"d MMMM yyyy",
																{
																	locale: fr,
																}
															)}
														</p>
													</div>
												</li>
											)}
										</ul>
									</div>
								</div>

								<div className="space-y-4">
									<div>
										<h3 className="text-sm font-semibold mb-2">
											Informations fiscales
										</h3>
										<ul className="space-y-3">
											{client.siren && (
												<li className="flex items-start gap-3">
													<FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">
															SIREN
														</p>
														<p className="text-sm">{client.siren}</p>
													</div>
												</li>
											)}

											{client.siret && (
												<li className="flex items-start gap-3">
													<FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">
															SIRET
														</p>
														<p className="text-sm">{client.siret}</p>
													</div>
												</li>
											)}

											{client.vatNumber && (
												<li className="flex items-start gap-3">
													<Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">TVA</p>
														<p className="text-sm">{client.vatNumber}</p>
													</div>
												</li>
											)}

											{!client.siren && !client.siret && !client.vatNumber && (
												<li className="text-muted-foreground text-sm">
													Aucune information fiscale renseignée
												</li>
											)}
										</ul>
									</div>
								</div>
							</div>

							{/* Notes du client si présentes */}
							{client.notes && (
								<div className="mt-6 pt-6 border-t border-dashed border-gray-200 dark:border-gray-800">
									<div className="flex items-start gap-2">
										<FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
										<div>
											<h3 className="text-sm font-semibold mb-1">Notes</h3>
											<p className="text-sm text-gray-700 dark:text-gray-300">
												{client.notes}
											</p>
										</div>
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Adresses */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<div>
								<CardTitle className="text-lg">Adresses</CardTitle>
								<CardDescription>Liste des adresses du client</CardDescription>
							</div>
						</CardHeader>

						<CardContent className="p-0 pt-2">
							{" "}
							{/* Suppression du padding pour mieux intégrer la liste */}
							<div className="pb-6">
								{" "}
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
											<Card key={id} className="p-3">
												<div className="flex items-start gap-2">
													<MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />

													<div className="min-w-0 flex-1">
														<div className="flex flex-wrap items-center gap-1.5 mb-0.5">
															<p className="text-sm font-medium">
																{addressLine1}
															</p>
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
											</Card>
										);
									})}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Colonne latérale (1/3) */}
				<div className="space-y-6">
					{/* Statistiques simples */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Résumé</CardTitle>
							<CardDescription>Aperçu des données client</CardDescription>
						</CardHeader>

						<CardContent>
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
						</CardContent>
					</Card>

					{/* Actions rapides */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Actions rapides</CardTitle>
						</CardHeader>

						<CardContent className="space-y-2">
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
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
