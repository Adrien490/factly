import { countClients } from "@/features/client/count";
import { PageContainer } from "@/features/shared/components/page-container";
import { PageHeader } from "@/features/shared/components/page-header";
import { Button } from "@/features/shared/components/ui/button";
import { Card } from "@/features/shared/components/ui/card";
import Link from "next/link";

type Props = {
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function DashboardPage({ params }: Props) {
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;
	const { count } = await countClients({
		organizationId,
		filters: {},
		search: "",
	});

	// Données statiques pour le dashboard
	const invoiceStats = {
		total: 32,
		paid: 24,
		overdue: 5,
		draft: 3,
		montantTotal: 68500,
		montantPayé: 52800,
	};

	const productStats = {
		total: 48,
		lowStock: 7,
		outOfStock: 3,
	};

	// Données pour les graphiques
	const monthlyRevenue = [
		18500, 14200, 16800, 19000, 12500, 22800, 20400, 24500, 26800, 22100, 18900,
		24000,
	];

	return (
		<PageContainer className="space-y-6 py-6">
			<PageHeader
				title="Tableau de bord"
				description="Aperçu de votre activité commerciale"
				className="mb-6"
			/>

			{/* Statistiques principales */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<Card className="p-4 border-l-4 border-l-blue-500">
					<div className="flex flex-col">
						<span className="text-sm font-medium text-muted-foreground">
							Clients
						</span>
						<span className="text-3xl font-bold">{count}</span>
						<div className="flex justify-between mt-1">
							<span className="text-xs text-green-500">+12% ce mois</span>
							<Link
								href={`/dashboard/${organizationId}/clients`}
								className="text-xs text-blue-500 hover:underline"
							>
								Voir tous
							</Link>
						</div>
					</div>
				</Card>
				<Card className="p-4 border-l-4 border-l-green-500">
					<div className="flex flex-col">
						<span className="text-sm font-medium text-muted-foreground">
							Factures
						</span>
						<span className="text-3xl font-bold">{invoiceStats.total}</span>
						<div className="flex justify-between mt-1">
							<span className="text-xs">{invoiceStats.paid} payées</span>
							<span className="text-xs text-amber-500">
								{invoiceStats.overdue} en retard
							</span>
						</div>
					</div>
				</Card>
				<Card className="p-4 border-l-4 border-l-yellow-500">
					<div className="flex flex-col">
						<span className="text-sm font-medium text-muted-foreground">
							Produits
						</span>
						<span className="text-3xl font-bold">{productStats.total}</span>
						<div className="flex justify-between mt-1">
							<span className="text-xs text-amber-500">
								{productStats.lowStock} en stock faible
							</span>
							<span className="text-xs text-red-500">
								{productStats.outOfStock} ruptures
							</span>
						</div>
					</div>
				</Card>
				<Card className="p-4 border-l-4 border-l-purple-500">
					<div className="flex flex-col">
						<span className="text-sm font-medium text-muted-foreground">
							Chiffre d&apos;affaires
						</span>
						<span className="text-3xl font-bold">
							{invoiceStats.montantTotal.toLocaleString("fr-FR")}€
						</span>
						<div className="flex justify-between mt-1">
							<span className="text-xs">
								{invoiceStats.montantPayé.toLocaleString("fr-FR")}€ encaissés
							</span>
							<span className="text-xs text-green-500">
								+18% vs mois précédent
							</span>
						</div>
					</div>
				</Card>
			</div>

			{/* Graphique CA et factures à traiter */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
				<Card className="lg:col-span-2 p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold">
							Chiffre d&apos;affaires mensuel
						</h2>
						<div className="text-sm text-muted-foreground">
							Total annuel:{" "}
							{monthlyRevenue
								.reduce((a, b) => a + b, 0)
								.toLocaleString("fr-FR")}
							€
						</div>
					</div>
					<div className="h-[300px] flex items-end gap-2">
						{monthlyRevenue.map((revenue, index) => (
							<div key={index} className="flex-1 flex flex-col items-center">
								<div
									className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all"
									style={{
										height: `${(revenue / Math.max(...monthlyRevenue)) * 80}%`,
									}}
								></div>
								<span className="text-xs text-muted-foreground mt-2">
									{
										[
											"Jan",
											"Fév",
											"Mar",
											"Avr",
											"Mai",
											"Juin",
											"Juil",
											"Août",
											"Sep",
											"Oct",
											"Nov",
											"Déc",
										][index]
									}
								</span>
							</div>
						))}
					</div>
				</Card>

				<Card className="p-4">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold">Factures à traiter</h2>
						<Button variant="outline" size="sm" asChild>
							<Link href={`/dashboard/${organizationId}/invoices`}>
								Toutes les factures
							</Link>
						</Button>
					</div>
					<div className="space-y-4">
						<div className="flex justify-between p-3 bg-amber-50 rounded-md">
							<div>
								<div className="font-medium">Factures en retard</div>
								<div className="text-sm text-muted-foreground">
									{invoiceStats.overdue} factures -{" "}
									{(
										invoiceStats.montantTotal - invoiceStats.montantPayé
									).toLocaleString("fr-FR")}
									€
								</div>
							</div>
							<Button variant="outline" size="sm">
								Traiter
							</Button>
						</div>
						<div className="flex justify-between p-3 bg-blue-50 rounded-md">
							<div>
								<div className="font-medium">Factures à envoyer</div>
								<div className="text-sm text-muted-foreground">
									{invoiceStats.draft} factures en brouillon
								</div>
							</div>
							<Button variant="outline" size="sm">
								Envoyer
							</Button>
						</div>
						<div className="flex justify-between p-3 bg-green-50 rounded-md">
							<div>
								<div className="font-medium">Devis en attente</div>
								<div className="text-sm text-muted-foreground">
									6 devis - 18 200€
								</div>
							</div>
							<Button variant="outline" size="sm">
								Relancer
							</Button>
						</div>
					</div>
				</Card>
			</div>

			{/* Clients et Inventaire */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<Card>
					<div className="p-4 border-b">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold">Derniers clients</h2>
							<Button variant="outline" size="sm" asChild>
								<Link href={`/dashboard/${organizationId}/clients`}>
									Tous les clients
								</Link>
							</Button>
						</div>
					</div>
					<div className="divide-y">
						{[
							{
								name: "Entreprise ABC",
								email: "contact@abc.fr",
								status: "ACTIVE",
								date: "Il y a 3j",
							},
							{
								name: "Studio Design XYZ",
								email: "hello@xyz.fr",
								status: "ACTIVE",
								date: "Il y a 5j",
							},
							{
								name: "Restaurant Le Gourmet",
								email: "info@legourmet.fr",
								status: "PROSPECT",
								date: "Il y a 1 sem",
							},
							{
								name: "Cabinet Martin",
								email: "contact@cabinetmartin.fr",
								status: "ACTIVE",
								date: "Il y a 2 sem",
							},
						].map((client, index) => (
							<div
								key={index}
								className="p-4 hover:bg-muted/50 transition-colors"
							>
								<div className="flex items-center justify-between">
									<div>
										<h3 className="font-medium">{client.name}</h3>
										<p className="text-sm text-muted-foreground">
											{client.email}
										</p>
									</div>
									<div className="flex flex-col items-end gap-1">
										<div
											className={`text-xs px-2 py-1 rounded ${
												client.status === "ACTIVE"
													? "bg-green-100 text-green-800"
													: "bg-yellow-100 text-yellow-800"
											}`}
										>
											{client.status === "ACTIVE" ? "Actif" : "Prospect"}
										</div>
										<span className="text-xs text-muted-foreground">
											{client.date}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</Card>

				<Card>
					<div className="p-4 border-b">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold">Stock à surveiller</h2>
							<Button variant="outline" size="sm" asChild>
								<Link href={`/dashboard/${organizationId}/products`}>
									Tous les produits
								</Link>
							</Button>
						</div>
					</div>
					<div className="divide-y">
						{[
							{
								name: "Papier A4 80g",
								stock: 12,
								min: 10,
								status: "LOW",
								supplier: "Office Supply Co",
							},
							{
								name: "Cartouche Encre Noire",
								stock: 5,
								min: 8,
								status: "LOW",
								supplier: "Tech Print",
							},
							{
								name: "Cahier premium 96p",
								stock: 0,
								min: 15,
								status: "OUT",
								supplier: "Papeterie Plus",
							},
							{
								name: "Stylos gel - noir",
								stock: 7,
								min: 20,
								status: "LOW",
								supplier: "Office Supply Co",
							},
						].map((product, index) => (
							<div
								key={index}
								className="p-4 hover:bg-muted/50 transition-colors"
							>
								<div className="flex items-center justify-between">
									<div>
										<h3 className="font-medium">{product.name}</h3>
										<p className="text-sm text-muted-foreground">
											Fournisseur: {product.supplier}
										</p>
									</div>
									<div className="flex flex-col items-end gap-1">
										<div
											className={`text-xs px-2 py-1 rounded ${
												product.status === "OUT"
													? "bg-red-100 text-red-800"
													: "bg-amber-100 text-amber-800"
											}`}
										>
											{product.status === "OUT" ? "Rupture" : "Stock faible"}
										</div>
										<span className="text-xs">
											{product.stock} / {product.min} unités
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</Card>
			</div>
		</PageContainer>
	);
}
