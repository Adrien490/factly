import { getClient } from "@/domains/client/features/get-client";
import { Button } from "@/shared/components/shadcn-ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/shared/components/shadcn-ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Mail, MapPin, Phone, PlusIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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

	if (!client) {
		return notFound();
	}

	return (
		<div className="space-y-8">
			{/* Actions rapides */}
			<div className="flex flex-wrap gap-3">
				<Button asChild size="sm" variant="outline">
					<Link
						href={`/dashboard/${organizationId}/clients/${clientId}/contacts/new`}
					>
						<PlusIcon className="h-4 w-4 mr-2" />
						Ajouter un contact
					</Link>
				</Button>
				<Button asChild size="sm" variant="outline">
					<Link
						href={`/dashboard/${organizationId}/clients/${clientId}/addresses/new`}
					>
						<MapPin className="h-4 w-4 mr-2" />
						Ajouter une adresse
					</Link>
				</Button>
			</div>

			{/* Informations principales avec mise en page améliorée */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle>Informations générales</CardTitle>
						<CardDescription>Détails essentiels du client</CardDescription>
					</CardHeader>
					<CardContent>
						<dl className="space-y-4">
							<div>
								<dt className="text-sm font-medium text-muted-foreground">
									Nom
								</dt>
								<dd className="mt-1">{client.name}</dd>
							</div>
							{client.email && (
								<div>
									<dt className="text-sm font-medium text-muted-foreground">
										Email
									</dt>
									<dd className="mt-1 flex items-center gap-2">
										<Mail className="h-4 w-4 text-muted-foreground" />
										<a
											href={`mailto:${client.email}`}
											className="hover:underline"
										>
											{client.email}
										</a>
									</dd>
								</div>
							)}
							{client.phone && (
								<div>
									<dt className="text-sm font-medium text-muted-foreground">
										Téléphone
									</dt>
									<dd className="mt-1 flex items-center gap-2">
										<Phone className="h-4 w-4 text-muted-foreground" />
										<a href={`tel:${client.phone}`} className="hover:underline">
											{client.phone}
										</a>
									</dd>
								</div>
							)}
						</dl>
					</CardContent>
					<CardFooter className="pt-0 border-t px-6 py-4">
						<Button asChild variant="outline" size="sm" className="w-full">
							<Link
								href={`/dashboard/${organizationId}/clients/${clientId}/edit`}
							>
								Modifier les informations
							</Link>
						</Button>
					</CardFooter>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle>Adresses</CardTitle>
						<CardDescription>Lieux associés au client</CardDescription>
					</CardHeader>
					<CardContent>
						{client.addresses && client.addresses.length > 0 ? (
							<div className="space-y-4">
								{client.addresses.slice(0, 2).map((address, index) => (
									<div key={index} className="bg-muted/50 p-3 rounded-md">
										<div className="font-medium">
											{address.isDefault
												? "Adresse principale"
												: "Adresse secondaire"}
										</div>
										<div className="text-sm text-muted-foreground mt-1">
											{[
												address.addressLine1,
												address.postalCode,
												address.city,
												address.country,
											]
												.filter(Boolean)
												.join(", ")}
										</div>
									</div>
								))}
								{client.addresses.length > 2 && (
									<div className="text-sm text-center text-muted-foreground">
										{client.addresses.length - 2} adresse(s) supplémentaire(s)
									</div>
								)}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-28 text-center text-muted-foreground bg-muted/50 rounded-md">
								<MapPin className="h-10 w-10 mb-2 opacity-20" />
								<p>Aucune adresse enregistrée</p>
							</div>
						)}
					</CardContent>
					<CardFooter className="pt-0 border-t px-6 py-4">
						<Button asChild variant="outline" size="sm" className="w-full">
							<Link
								href={`/dashboard/${organizationId}/clients/${clientId}/addresses`}
							>
								{client.addresses && client.addresses.length > 0
									? "Gérer les adresses"
									: "Ajouter une adresse"}
							</Link>
						</Button>
					</CardFooter>
				</Card>

				<Card className="md:col-span-2 lg:col-span-1">
					<CardHeader className="pb-3">
						<CardTitle>Statistiques</CardTitle>
						<CardDescription>
							Vue d&apos;ensemble de l&apos;activité
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div className="bg-muted/50 p-4 rounded-md text-center">
								<div className="text-3xl font-semibold">
									{client.addresses?.length || 0}
								</div>
								<div className="text-sm text-muted-foreground mt-1">
									Adresses
								</div>
							</div>
							<div className="bg-muted/50 p-4 rounded-md text-center">
								<div className="text-3xl font-semibold">0</div>
								<div className="text-sm text-muted-foreground mt-1">
									Contacts
								</div>
							</div>
							<div className="bg-muted/50 p-4 rounded-md text-center col-span-2">
								<div className="text-sm text-muted-foreground">
									Dernier contact
								</div>
								<div className="mt-1">
									{client.updatedAt
										? format(new Date(client.updatedAt), "PPP", { locale: fr })
										: "Jamais"}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
