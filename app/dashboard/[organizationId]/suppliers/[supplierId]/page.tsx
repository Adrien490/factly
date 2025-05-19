import { getSupplier } from "@/domains/supplier/features/get-supplier";
import { ContentCard } from "@/shared/components/content-card";
import { Country } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import NotFound from "../../not-found";

type Props = {
	params: Promise<{
		organizationId: string;
		supplierId: string;
	}>;
};

export default async function SupplierPage({ params }: Props) {
	const { organizationId, supplierId } = await params;

	const supplier = await getSupplier({ id: supplierId, organizationId });

	if (!supplier) {
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
						title="Informations du fournisseur"
						description="Coordonnées et informations générales"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Informations de contact */}
							<div className="space-y-4">
								<div>
									<h3 className="text-sm font-semibold mb-2">Coordonnées</h3>
									<ul className="space-y-3">
										{supplier.company?.email && (
											<li>
												<div>
													<p className="text-xs text-muted-foreground">Email</p>
													<a
														href={`mailto:${supplier.company.email}`}
														className="text-sm hover:underline"
													>
														{supplier.company.email}
													</a>
												</div>
											</li>
										)}

										{supplier.company?.phoneNumber && (
											<li>
												<div>
													<p className="text-xs text-muted-foreground">
														Téléphone
													</p>
													<a
														href={`tel:${supplier.company.phoneNumber}`}
														className="text-sm hover:underline"
													>
														{supplier.company.phoneNumber}
													</a>
												</div>
											</li>
										)}

										{supplier.company?.website && (
											<li>
												<div>
													<p className="text-xs text-muted-foreground">
														Site web
													</p>
													<a
														href={supplier.company.website}
														target="_blank"
														rel="noopener noreferrer"
														className="text-sm hover:underline"
													>
														{supplier.company.website.replace(
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

							{/* Informations fiscales et légales */}
							<div className="space-y-4">
								<div>
									<h3 className="text-sm font-semibold mb-2">
										Informations fiscales et légales
									</h3>
									<ul className="space-y-3">
										{supplier.company?.siren && (
											<li>
												<div>
													<p className="text-xs text-muted-foreground">SIREN</p>
													<p className="text-sm">{supplier.company.siren}</p>
												</div>
											</li>
										)}

										{supplier.company?.siret && (
											<li>
												<div>
													<p className="text-xs text-muted-foreground">SIRET</p>
													<p className="text-sm">{supplier.company.siret}</p>
												</div>
											</li>
										)}

										{supplier.company?.vatNumber && (
											<li>
												<div>
													<p className="text-xs text-muted-foreground">TVA</p>
													<p className="text-sm">
														{supplier.company.vatNumber}
													</p>
												</div>
											</li>
										)}

										{!supplier.company?.siren &&
											!supplier.company?.siret &&
											!supplier.company?.vatNumber && (
												<li className="text-muted-foreground text-sm">
													Aucune information légale renseignée
												</li>
											)}
									</ul>
								</div>
							</div>
						</div>
					</ContentCard>

					{/* Adresses */}
					<ContentCard title="Adresses">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{/* Adresse de facturation */}
							{supplier.addresses.find(
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
												const address = supplier.addresses.find(
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
							{supplier.addresses.find(
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
												const address = supplier.addresses.find(
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
							{!supplier.addresses.find(
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
									{supplier.addresses.length || 0}
								</span>
								<span className="text-xs text-muted-foreground mt-1">
									Adresses
								</span>
							</div>
							<div className="bg-muted/40 rounded-lg p-4 flex flex-col items-center justify-center">
								<span className="text-xs text-muted-foreground mb-1">
									Fournisseur depuis
								</span>
								<span className="text-sm font-medium text-center">
									{supplier.createdAt
										? format(new Date(supplier.createdAt), "dd/MM/yyyy", {
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
