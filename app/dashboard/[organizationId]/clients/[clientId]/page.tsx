import { getAddresses } from "@/domains/address/features";
import { AddressList } from "@/domains/address/features/get-addresses/components";
import { AddressListSkeleton } from "@/domains/address/features/get-addresses/components/address-list/components/address-list-skeleton/address-list-skeleton";
import { getClient } from "@/domains/client/features/get-client";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/shared/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
	Building2,
	Calendar,
	CircleDollarSign,
	FileEdit,
	FileText,
	Globe,
	Mail,
	MapPin,
	Phone,
	PlusIcon,
	Users,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

type Props = {
	params: Promise<{
		organizationId: string;
		clientId: string;
	}>;
};

export default async function ClientPage({ params }: Props) {
	const resolvedParams = await params;
	const { organizationId, clientId } = resolvedParams;

	const client = await getClient({ id: clientId, organizationId });

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
							<Button asChild variant="outline" size="sm">
								<Link
									href={`/dashboard/${organizationId}/clients/${clientId}/addresses/new`}
								>
									<PlusIcon className="h-4 w-4 mr-1" />
									Ajouter
								</Link>
							</Button>
						</CardHeader>

						<CardContent className="p-0 pt-2">
							{" "}
							{/* Suppression du padding pour mieux intégrer la liste */}
							<div className="pb-6">
								{" "}
								<Suspense fallback={<AddressListSkeleton viewType="grid" />}>
									<AddressList
										viewType="grid"
										addressesPromise={getAddresses({
											clientId,
											filters: {},
											sortBy: "createdAt",
											sortOrder: "desc",
										})}
										clientId={clientId}
									/>
								</Suspense>
							</div>
						</CardContent>

						<CardFooter className="border-t px-6 py-4">
							<Button asChild variant="outline" size="sm" className="w-full">
								<Link
									href={`/dashboard/${organizationId}/clients/${clientId}/addresses`}
								>
									Gérer les adresses
								</Link>
							</Button>
						</CardFooter>
					</Card>

					{/* Onglets pour l'activité (fonctionnalités futures) */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Activité</CardTitle>
							<CardDescription>Devis et factures</CardDescription>
						</CardHeader>
						<CardContent>
							<Tabs defaultValue="contacts" className="w-full">
								<TabsList className="grid w-full grid-cols-4">
									<TabsTrigger value="contacts">
										<Users className="h-4 w-4 mr-2" />
										Contacts
									</TabsTrigger>
									<TabsTrigger value="quotes">
										<FileText className="h-4 w-4 mr-2" />
										Devis
									</TabsTrigger>
									<TabsTrigger value="invoices">
										<CircleDollarSign className="h-4 w-4 mr-2" />
										Factures
									</TabsTrigger>
								</TabsList>

								<div className="mt-4 border rounded-md p-6">
									<TabsContent value="contacts" className="mt-0">
										<div className="text-center text-muted-foreground">
											<p>
												La gestion des contacts sera disponible prochainement.
											</p>
										</div>
									</TabsContent>

									<TabsContent value="quotes" className="mt-0">
										<div className="text-center text-muted-foreground">
											<p>La gestion des devis sera disponible prochainement.</p>
										</div>
									</TabsContent>

									<TabsContent value="invoices" className="mt-0">
										<div className="text-center text-muted-foreground">
											<p>
												La gestion des factures sera disponible prochainement.
											</p>
										</div>
									</TabsContent>

									<TabsContent value="activity" className="mt-0">
										<div className="text-center text-muted-foreground">
											<p>
												L&apos;historique d&apos;activité sera disponible
												prochainement.
											</p>
										</div>
									</TabsContent>
								</div>
							</Tabs>
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

							<Separator className="my-4" />

							{/* Raccourcis d'action */}
							<div className="space-y-2">
								<Button
									asChild
									variant="outline"
									className="w-full justify-start"
								>
									<Link
										href={`/dashboard/${organizationId}/clients/${clientId}/edit`}
									>
										<FileEdit className="h-4 w-4 mr-2" />
										Modifier le client
									</Link>
								</Button>
								<Button
									asChild
									variant="outline"
									className="w-full justify-start"
								>
									<Link
										href={`/dashboard/${organizationId}/clients/${clientId}/addresses`}
									>
										<MapPin className="h-4 w-4 mr-2" />
										Gérer les adresses
									</Link>
								</Button>
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
									href={`/dashboard/${organizationId}/clients/${clientId}/contacts/new`}
								>
									<Users className="h-4 w-4 mr-2" />
									Ajouter un contact
								</Link>
							</Button>
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
							<Button
								asChild
								variant="secondary"
								className="w-full justify-start"
							>
								<Link
									href={`/dashboard/${organizationId}/quotes/new?clientId=${clientId}`}
								>
									<FileText className="h-4 w-4 mr-2" />
									Créer un devis
								</Link>
							</Button>
							<Button
								asChild
								variant="secondary"
								className="w-full justify-start"
							>
								<Link
									href={`/dashboard/${organizationId}/invoices/new?clientId=${clientId}`}
								>
									<CircleDollarSign className="h-4 w-4 mr-2" />
									Créer une facture
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
