import {
	FISCAL_YEAR_STATUS_COLORS,
	FISCAL_YEAR_STATUS_LABELS,
} from "@/domains/fiscal-year/constants";
import { getFiscalYear } from "@/domains/fiscal-year/features/get-fiscal-year/queries";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, FileText, PencilIcon } from "lucide-react";
import Link from "next/link";
import NotFound from "../../not-found";

type Props = {
	params: Promise<{
		fiscalYearId: string;
	}>;
};

export default async function FiscalYearPage({ params }: Props) {
	const { fiscalYearId } = await params;

	const fiscalYear = await getFiscalYear({ id: fiscalYearId });

	if (!fiscalYear) {
		return <NotFound />;
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Colonne principale (2/3) */}
				<div className="lg:col-span-2 space-y-6">
					{/* Informations essentielles */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								Informations de l&apos;année fiscale
							</CardTitle>
							<CardDescription>
								Période et paramètres de l&apos;année fiscale
							</CardDescription>
						</CardHeader>

						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div>
										<h3 className="text-sm font-semibold mb-2">Période</h3>
										<ul className="space-y-3">
											<li className="flex items-start gap-3">
												<Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-xs text-muted-foreground">
														Date de début
													</p>
													<p className="text-sm">
														{format(
															new Date(fiscalYear.startDate),
															"d MMMM yyyy",
															{ locale: fr }
														)}
													</p>
												</div>
											</li>

											<li className="flex items-start gap-3">
												<Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-xs text-muted-foreground">
														Date de fin
													</p>
													<p className="text-sm">
														{format(
															new Date(fiscalYear.endDate),
															"d MMMM yyyy",
															{ locale: fr }
														)}
													</p>
												</div>
											</li>

											<li className="flex items-start gap-3">
												<Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-xs text-muted-foreground">Durée</p>
													<p className="text-sm">
														{Math.round(
															(new Date(fiscalYear.endDate).getTime() -
																new Date(fiscalYear.startDate).getTime()) /
																(1000 * 60 * 60 * 24)
														)}{" "}
														jours
													</p>
												</div>
											</li>
										</ul>
									</div>
								</div>

								<div className="space-y-4">
									<div>
										<h3 className="text-sm font-semibold mb-2">Paramètres</h3>
										<ul className="space-y-3">
											<li className="flex items-start gap-3">
												<FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-xs text-muted-foreground">
														Statut
													</p>
													<p
														className="text-sm font-medium"
														style={{
															color:
																FISCAL_YEAR_STATUS_COLORS[fiscalYear.status],
														}}
													>
														{FISCAL_YEAR_STATUS_LABELS[fiscalYear.status]}
													</p>
												</div>
											</li>

											<li className="flex items-start gap-3">
												<Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-xs text-muted-foreground">
														Année courante
													</p>
													<p className="text-sm">
														{fiscalYear.isCurrent ? "Oui" : "Non"}
													</p>
												</div>
											</li>
										</ul>
									</div>
								</div>
							</div>

							{/* Notes si présentes */}
							{fiscalYear.description && (
								<div className="mt-6 pt-6 border-t border-dashed border-gray-200 dark:border-gray-800">
									<div className="flex items-start gap-2">
										<FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
										<div>
											<h3 className="text-sm font-semibold mb-1">
												Description
											</h3>
											<p className="text-sm text-gray-700 dark:text-gray-300">
												{fiscalYear.description}
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
							<CardDescription>Aperçu de l&apos;année fiscale</CardDescription>
						</CardHeader>

						<CardContent>
							<div className="grid grid-cols-2 gap-4 mb-4">
								<div className="bg-muted/40 rounded-lg p-4 flex flex-col items-center justify-center">
									<span className="text-xs text-muted-foreground mb-1">
										Créé le
									</span>
									<span className="text-sm font-medium text-center">
										{format(new Date(fiscalYear.createdAt), "dd/MM/yyyy", {
											locale: fr,
										})}
									</span>
								</div>
								<div className="bg-muted/40 rounded-lg p-4 flex flex-col items-center justify-center">
									<span className="text-xs text-muted-foreground mb-1">
										Dernière mise à jour
									</span>
									<span className="text-sm font-medium text-center">
										{format(new Date(fiscalYear.updatedAt), "dd/MM/yyyy", {
											locale: fr,
										})}
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
								<Link href={`/dashboard/fiscal-years/${fiscalYearId}/edit`}>
									<PencilIcon className="h-4 w-4 mr-2" />
									Modifier l&apos;année fiscale
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
