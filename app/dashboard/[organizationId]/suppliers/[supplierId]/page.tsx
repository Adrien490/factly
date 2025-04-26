import { ADDRESS_TYPES } from "@/domains/address/constants";
import { CreateAddressForm, searchAddress } from "@/domains/address/features";
import { DeleteAddressButton } from "@/domains/address/features/delete-address/components/delete-address-button";
import { getSupplier } from "@/domains/supplier/features/get-supplier";
import { AlertDialogFooter, AlertDialogHeader } from "@/shared/components";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Country } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
	Box,
	Building2,
	Calendar,
	Contact,
	FileText,
	Globe,
	Mail,
	MapPin,
	MoreHorizontal,
	Phone,
	PlusIcon,
	Tag,
	Trash,
	UserRound,
	Warehouse,
} from "lucide-react";
import Link from "next/link";
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
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								Informations du fournisseur
							</CardTitle>
							<CardDescription>
								Coordonnées et informations générales
							</CardDescription>
						</CardHeader>

						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div>
										<h3 className="text-sm font-semibold mb-2">Coordonnées</h3>
										<ul className="space-y-3">
											{supplier.email && (
												<li className="flex items-start gap-3">
													<Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">
															Email
														</p>
														<a
															href={`mailto:${supplier.email}`}
															className="text-sm hover:underline"
														>
															{supplier.email}
														</a>
													</div>
												</li>
											)}

											{supplier.phone && (
												<li className="flex items-start gap-3">
													<Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">
															Téléphone
														</p>
														<a
															href={`tel:${supplier.phone}`}
															className="text-sm hover:underline"
														>
															{supplier.phone}
														</a>
													</div>
												</li>
											)}

											{supplier.website && (
												<li className="flex items-start gap-3">
													<Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">
															Site web
														</p>
														<a
															href={supplier.website}
															target="_blank"
															rel="noopener noreferrer"
															className="text-sm hover:underline"
														>
															{supplier.website.replace(
																/^https?:\/\/(www\.)?/,
																""
															)}
														</a>
													</div>
												</li>
											)}

											{supplier.createdAt && (
												<li className="flex items-start gap-3">
													<Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">
															Fournisseur depuis
														</p>
														<p className="text-sm">
															{format(
																new Date(supplier.createdAt),
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
											Informations fiscales et légales
										</h3>
										<ul className="space-y-3">
											{supplier.supplierType && (
												<li className="flex items-start gap-3">
													<Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">
															Type
														</p>
														<p className="text-sm capitalize">
															{supplier.supplierType
																.toLowerCase()
																.replace("_", " ")}
														</p>
													</div>
												</li>
											)}

											{supplier.siren && (
												<li className="flex items-start gap-3">
													<FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">
															SIREN
														</p>
														<p className="text-sm">{supplier.siren}</p>
													</div>
												</li>
											)}

											{supplier.siret && (
												<li className="flex items-start gap-3">
													<FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">
															SIRET
														</p>
														<p className="text-sm">{supplier.siret}</p>
													</div>
												</li>
											)}

											{supplier.vatNumber && (
												<li className="flex items-start gap-3">
													<Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">TVA</p>
														<p className="text-sm">{supplier.vatNumber}</p>
													</div>
												</li>
											)}

											{!supplier.siren &&
												!supplier.siret &&
												!supplier.vatNumber &&
												!supplier.supplierType && (
													<li className="text-muted-foreground text-sm">
														Aucune information légale renseignée
													</li>
												)}
										</ul>
									</div>
								</div>
							</div>

							{/* Notes du fournisseur si présentes */}
							{supplier.notes && (
								<div className="mt-6 pt-6 border-t border-dashed border-gray-200 dark:border-gray-800">
									<div className="flex items-start gap-2">
										<FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
										<div>
											<h3 className="text-sm font-semibold mb-1">Notes</h3>
											<p className="text-sm text-gray-700 dark:text-gray-300">
												{supplier.notes}
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
								<CardDescription>Adresses du fournisseur</CardDescription>
							</div>
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="outline">
										<PlusIcon className="h-4 w-4 mr-2" />
										Ajouter une adresse
									</Button>
								</DialogTrigger>
								<DialogContent className="">
									<DialogHeader>
										<DialogTitle>Ajouter une adresse</DialogTitle>
										<DialogDescription>
											Ajouter une adresse pour le fournisseur
										</DialogDescription>
									</DialogHeader>
									<CreateAddressForm
										searchAddressPromise={searchAddress({
											query: "",
											limit: 10,
										})}
									/>
								</DialogContent>
							</Dialog>
						</CardHeader>

						<CardContent className="p-0 pt-2">
							<div className="pb-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{supplier.addresses && supplier.addresses.length > 0 ? (
										supplier.addresses.map((address) => {
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

														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<MoreHorizontal className="h-4 w-4 text-muted-foreground cursor-pointer" />
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuItem asChild>
																	Modifier
																</DropdownMenuItem>
																<AlertDialog>
																	<AlertDialogTrigger asChild>
																		<DropdownMenuItem
																			preventDefault
																			className="text-destructive focus:text-destructive"
																		>
																			<Trash className="text-destructive h-4 w-4 mr-2" />
																			<span>Supprimer</span>
																		</DropdownMenuItem>
																	</AlertDialogTrigger>
																	<AlertDialogContent>
																		<AlertDialogHeader>
																			<AlertDialogTitle className="text-destructive">
																				Êtes-vous sûr de vouloir supprimer cette
																				adresse ?
																			</AlertDialogTitle>
																			<AlertDialogDescription>
																				Cette action est irréversible. Cela
																				supprimera définitivement l&apos;adresse
																				{addressLine1 && (
																					<strong> {addressLine1}</strong>
																				)}{" "}
																				et toutes ses données associées.
																			</AlertDialogDescription>
																		</AlertDialogHeader>
																		<AlertDialogFooter>
																			<AlertDialogCancel>
																				Annuler
																			</AlertDialogCancel>
																			<DeleteAddressButton
																				organizationId={organizationId}
																				id={id}
																			>
																				<AlertDialogAction>
																					Supprimer
																				</AlertDialogAction>
																			</DeleteAddressButton>
																		</AlertDialogFooter>
																	</AlertDialogContent>
																</AlertDialog>
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
												</Card>
											);
										})
									) : (
										<div className="col-span-2 text-muted-foreground text-sm text-center p-4">
											Aucune adresse disponible
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Contacts */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<div>
								<CardTitle className="text-lg">Contacts</CardTitle>
								<CardDescription>
									Personnes à contacter chez ce fournisseur
								</CardDescription>
							</div>
							<Button variant="outline">
								<PlusIcon className="h-4 w-4 mr-2" />
								Ajouter un contact
							</Button>
						</CardHeader>

						<CardContent className="p-0 pt-2">
							<div className="pb-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{supplier.contacts && supplier.contacts.length > 0 ? (
										supplier.contacts.map((contact) => (
											<Card key={contact.id} className="p-3">
												<div className="flex items-start gap-2">
													<UserRound className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />

													<div className="min-w-0 flex-1">
														<div className="flex flex-wrap items-center gap-1.5 mb-0.5">
															<p className="text-sm font-medium">
																{contact.firstName} {contact.lastName}
															</p>
															{contact.isDefault && (
																<span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
																	Contact principal
																</span>
															)}
														</div>

														{contact.title && (
															<p className="text-xs text-muted-foreground">
																{contact.title}
															</p>
														)}

														<div className="mt-2 space-y-1">
															{contact.email && (
																<p className="text-xs flex items-center gap-1.5">
																	<Mail className="h-3 w-3 text-muted-foreground" />
																	<a
																		href={`mailto:${contact.email}`}
																		className="hover:underline"
																	>
																		{contact.email}
																	</a>
																</p>
															)}
															{contact.phone && (
																<p className="text-xs flex items-center gap-1.5">
																	<Phone className="h-3 w-3 text-muted-foreground" />
																	<a
																		href={`tel:${contact.phone}`}
																		className="hover:underline"
																	>
																		{contact.phone}
																	</a>
																</p>
															)}
														</div>
													</div>

													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<MoreHorizontal className="h-4 w-4 text-muted-foreground cursor-pointer" />
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem asChild>
																Modifier
															</DropdownMenuItem>
															<DropdownMenuItem className="text-destructive focus:text-destructive">
																<Trash className="text-destructive h-4 w-4 mr-2" />
																<span>Supprimer</span>
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											</Card>
										))
									) : (
										<div className="col-span-2 text-muted-foreground text-sm text-center p-4">
											Aucun contact disponible
										</div>
									)}
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
							<CardDescription>Aperçu des données fournisseur</CardDescription>
						</CardHeader>

						<CardContent>
							<div className="grid grid-cols-2 gap-4 mb-4">
								<div className="bg-muted/40 rounded-lg p-4 flex flex-col items-center justify-center">
									<span className="text-2xl font-bold">
										{supplier.addresses ? supplier.addresses.length : 0}
									</span>
									<span className="text-xs text-muted-foreground mt-1">
										Adresses
									</span>
								</div>
								<div className="bg-muted/40 rounded-lg p-4 flex flex-col items-center justify-center">
									<span className="text-2xl font-bold">
										{supplier.contacts ? supplier.contacts.length : 0}
									</span>
									<span className="text-xs text-muted-foreground mt-1">
										Contacts
									</span>
								</div>
							</div>

							<div className="bg-muted/40 rounded-lg p-4 space-y-1">
								<span className="text-xs text-muted-foreground">
									Dernière mise à jour
								</span>
								<span className="text-sm font-medium block">
									{supplier.updatedAt
										? format(new Date(supplier.updatedAt), "dd/MM/yyyy", {
												locale: fr,
										  })
										: "Jamais"}
								</span>
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
									href={`/dashboard/${organizationId}/suppliers/${supplierId}/addresses/new`}
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
									href={`/dashboard/${organizationId}/suppliers/${supplierId}/contacts/new`}
								>
									<Contact className="h-4 w-4 mr-2" />
									Ajouter un contact
								</Link>
							</Button>
							<Button
								asChild
								variant="secondary"
								className="w-full justify-start"
							>
								<Link
									href={`/dashboard/${organizationId}/products/new?supplierId=${supplierId}`}
								>
									<Box className="h-4 w-4 mr-2" />
									Ajouter un produit
								</Link>
							</Button>
							<Button
								asChild
								variant="secondary"
								className="w-full justify-start"
							>
								<Link
									href={`/dashboard/${organizationId}/suppliers/${supplierId}/orders/new`}
								>
									<Warehouse className="h-4 w-4 mr-2" />
									Commander des produits
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
