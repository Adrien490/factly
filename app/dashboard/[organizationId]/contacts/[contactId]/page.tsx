import { getContact } from "@/domains/contact/features/get-contact";
import { ContentCard } from "@/shared/components/content-card";
import { Button } from "@/shared/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Mail, Phone } from "lucide-react";
import Link from "next/link";
import NotFound from "../../not-found";

type Props = {
	params: Promise<{
		organizationId: string;
		contactId: string;
	}>;
};

export default async function ContactPage({ params }: Props) {
	const { organizationId, contactId } = await params;

	const contact = await getContact({ id: contactId, organizationId });

	if (!contact) {
		return <NotFound />;
	}

	return (
		<div className="space-y-6">
			{/* Conteneur principal à deux colonnes */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Colonne principale (2/3) */}
				<div className="lg:col-span-2 space-y-6">
					{/* Informations essentielles */}
					<ContentCard
						title="Informations du contact"
						description="Détails du contact"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Informations de contact */}
							<div className="space-y-4">
								<div>
									<h3 className="text-sm font-semibold mb-2">Coordonnées</h3>
									<ul className="space-y-3">
										{contact.email && (
											<li className="flex items-start gap-3">
												<Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-xs text-muted-foreground">Email</p>
													<a
														href={`mailto:${contact.email}`}
														className="text-sm hover:underline"
													>
														{contact.email}
													</a>
												</div>
											</li>
										)}

										{contact.phoneNumber && (
											<li className="flex items-start gap-3">
												<Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-xs text-muted-foreground">
														Téléphone
													</p>
													<a
														href={`tel:${contact.phoneNumber}`}
														className="text-sm hover:underline"
													>
														{contact.phoneNumber}
													</a>
												</div>
											</li>
										)}

										{contact.mobileNumber && (
											<li className="flex items-start gap-3">
												<Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-xs text-muted-foreground">
														Téléphone mobile
													</p>
													<a
														href={`tel:${contact.mobileNumber}`}
														className="text-sm hover:underline"
													>
														{contact.mobileNumber}
													</a>
												</div>
											</li>
										)}

										{contact.website && (
											<li className="flex items-start gap-3">
												<div>
													<p className="text-xs text-muted-foreground">
														Site web
													</p>
													<a
														href={contact.website}
														target="_blank"
														rel="noopener noreferrer"
														className="text-sm hover:underline"
													>
														{contact.website.replace(
															/^https?:\/\/(www\.)?/,
															""
														)}
													</a>
												</div>
											</li>
										)}

										{contact.createdAt && (
											<li className="flex items-start gap-3">
												<Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-xs text-muted-foreground">
														Contact depuis
													</p>
													<p className="text-sm">
														{format(
															new Date(contact.createdAt),
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

							{/* Informations personnelles */}
							<div className="space-y-4">
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
													{contact.firstName} {contact.lastName}
												</p>
											</div>
										</li>
										{contact.function && (
											<li className="flex items-start gap-3">
												<div>
													<p className="text-xs text-muted-foreground">
														Fonction
													</p>
													<p className="text-sm">{contact.function}</p>
												</div>
											</li>
										)}
									</ul>
								</div>
							</div>
						</div>
					</ContentCard>
				</div>

				{/* Colonne latérale (1/3) */}
				<div className="space-y-6">
					{/* Statistiques simples */}
					<ContentCard title="Résumé" description="Aperçu des données contact">
						<div className="grid grid-cols-2 gap-4 mb-4">
							<div className="bg-muted/40 rounded-lg p-4 flex flex-col items-center justify-center">
								<span className="text-xs text-muted-foreground mb-1">
									Dernière mise à jour
								</span>
								<span className="text-sm font-medium text-center">
									{contact.updatedAt
										? format(new Date(contact.updatedAt), "dd/MM/yyyy", {
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
						description="Actions disponibles pour ce contact"
					>
						<div className="space-y-2">
							{contact.clientId && (
								<Button
									asChild
									variant="secondary"
									className="w-full justify-start"
								>
									<Link
										href={`/dashboard/${organizationId}/clients/${contact.clientId}`}
									>
										Voir le client associé
									</Link>
								</Button>
							)}
							{contact.supplierId && (
								<Button
									asChild
									variant="secondary"
									className="w-full justify-start"
								>
									<Link
										href={`/dashboard/${organizationId}/suppliers/${contact.supplierId}`}
									>
										Voir le fournisseur associé
									</Link>
								</Button>
							)}
						</div>
					</ContentCard>
				</div>
			</div>
		</div>
	);
}
