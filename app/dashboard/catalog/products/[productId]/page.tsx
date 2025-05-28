import { VAT_RATE_LABELS } from "@/domains/product";
import { getProduct } from "@/domains/product/features/get-product";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { formatPrice } from "@/shared/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
	Box,
	Calendar,
	FileText,
	ImageIcon,
	PercentSquare,
	Receipt,
	Tag,
	Truck,
} from "lucide-react";
import Image from "next/image";
import NotFound from "../../../../not-found";

type Props = {
	params: Promise<{
		productId: string;
	}>;
};

export default async function ProductPage({ params }: Props) {
	const { productId } = await params;

	const product = await getProduct({ id: productId });

	if (!product) {
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
							<CardTitle className="text-lg">Informations du produit</CardTitle>
							<CardDescription>
								Détails et caractéristiques du produit
							</CardDescription>
						</CardHeader>

						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div>
										<h3 className="text-sm font-semibold mb-2">
											Caractéristiques
										</h3>
										<ul className="space-y-3">
											<li className="flex items-start gap-3">
												<Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-xs text-muted-foreground">
														Référence
													</p>
													<p className="text-sm">{product.reference}</p>
												</div>
											</li>

											<li className="flex items-start gap-3">
												<Receipt className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-xs text-muted-foreground">
														Prix HT
													</p>
													<p className="text-sm font-medium">
														{formatPrice(product.price)}
													</p>
												</div>
											</li>

											<li className="flex items-start gap-3">
												<PercentSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-xs text-muted-foreground">
														Taux TVA
													</p>
													<p className="text-sm">
														{VAT_RATE_LABELS[product.vatRate]}
													</p>
												</div>
											</li>

											{product.category && (
												<li className="flex items-start gap-3">
													<Box className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">
															Catégorie
														</p>
														<p className="text-sm">{product.category.name}</p>
													</div>
												</li>
											)}

											{product.createdAt && (
												<li className="flex items-start gap-3">
													<Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">
															Créé le
														</p>
														<p className="text-sm">
															{format(
																new Date(product.createdAt),
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
										<h3 className="text-sm font-semibold mb-2">Fournisseur</h3>
										{product.supplier ? (
											<ul className="space-y-3">
												<li className="flex items-start gap-3">
													<Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
													<div>
														<p className="text-xs text-muted-foreground">
															Référence du fournisseur
														</p>
														<p className="text-sm">
															{product.supplier.reference}
														</p>
													</div>
												</li>
											</ul>
										) : (
											<p className="text-sm text-muted-foreground">
												Aucun fournisseur associé
											</p>
										)}
									</div>

									<div className="mt-6">
										<h3 className="text-sm font-semibold mb-2">
											Image du produit
										</h3>
										{product.imageUrl ? (
											<div className="relative h-48 w-full rounded-md overflow-hidden">
												<Image
													src={product.imageUrl}
													alt={product.name}
													fill
													sizes="(min-width: 1024px) 384px, 100vw"
													className="object-contain"
													priority
												/>
											</div>
										) : (
											<div className="h-48 w-full rounded-md bg-muted flex items-center justify-center">
												<div className="text-center">
													<ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
													<p className="text-sm text-muted-foreground">
														Aucune image disponible
													</p>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Description du produit si présente */}
							{product.description && (
								<div className="mt-6 pt-6 border-t border-dashed border-gray-200 dark:border-gray-800">
									<div className="flex items-start gap-2">
										<FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
										<div>
											<h3 className="text-sm font-semibold mb-1">
												Description
											</h3>
											<p className="text-sm text-gray-700 dark:text-gray-300">
												{product.description}
											</p>
										</div>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Colonne latérale (1/3) */}
				<div className="space-y-6">
					{/* Statistiques simples */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Résumé</CardTitle>
							<CardDescription>Aperçu des données produit</CardDescription>
						</CardHeader>

						<CardContent>
							<div className="bg-muted/40 rounded-lg p-4 space-y-2 mb-4">
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">Prix HT</span>
									<span className="text-sm font-medium">
										{formatPrice(product.price)}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">TVA</span>
									<span className="text-sm">
										{VAT_RATE_LABELS[product.vatRate]}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">
										Prix TTC
									</span>
									<span className="text-sm font-semibold">
										{formatPrice(
											product.price *
												(1 +
													parseFloat(
														product.vatRate.replace("_", ".").split("_")[1] ||
															"0.2"
													))
										)}
									</span>
								</div>
							</div>

							<div className="bg-muted/40 rounded-lg p-4 space-y-1">
								<span className="text-xs text-muted-foreground">
									Dernière mise à jour
								</span>
								<span className="text-sm font-medium block">
									{product.updatedAt
										? format(new Date(product.updatedAt), "dd/MM/yyyy", {
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

						<CardContent className="space-y-2"></CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
