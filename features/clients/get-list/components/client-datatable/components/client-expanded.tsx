"use client";

import { CLIENT_STATUS_OPTIONS } from "@/features/clients/client-status-options";
import { CLIENT_TYPE_OPTIONS } from "@/features/clients/client-type-options";
import { GetClientsReturn } from "@/features/clients/get-list/types";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { formatDate } from "@/shared/lib/utils";
import {
	Building,
	Calendar,
	Globe,
	Mail,
	MapPin,
	Phone,
	Receipt,
	Tag,
	User,
} from "lucide-react";

interface ClientExpandedProps {
	client: GetClientsReturn["clients"][number];
}

export function ClientExpanded({ client }: ClientExpandedProps) {
	const defaultAddress = client.addresses?.find((addr) => addr.isDefault);
	const clientType =
		CLIENT_TYPE_OPTIONS.find((type) => type.value === client.clientType)
			?.label || "Non spécifié";
	const clientStatus =
		CLIENT_STATUS_OPTIONS.find((status) => status.value === client.status)
			?.label || "Non spécifié";

	return (
		<div className="p-4 bg-muted/30 grid md:grid-cols-2 gap-4">
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">
						Informations générales
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="grid grid-cols-2 gap-2">
						<div className="flex items-center gap-2 text-sm">
							<User className="h-4 w-4 text-muted-foreground" />
							<span className="font-medium">Nom:</span>
							<span>{client.name}</span>
						</div>
						{client.reference && (
							<div className="flex items-center gap-2 text-sm">
								<Tag className="h-4 w-4 text-muted-foreground" />
								<span className="font-medium">Référence:</span>
								<span>{client.reference}</span>
							</div>
						)}
					</div>

					<div className="grid grid-cols-2 gap-2">
						<div className="flex items-center gap-2 text-sm">
							<Building className="h-4 w-4 text-muted-foreground" />
							<span className="font-medium">Type:</span>
							<span>{clientType}</span>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<span className="font-medium">Statut:</span>
							<span>{clientStatus}</span>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2">
						{client.email && (
							<div className="flex items-center gap-2 text-sm">
								<Mail className="h-4 w-4 text-muted-foreground" />
								<span className="font-medium">Email:</span>
								<span className="truncate">{client.email}</span>
							</div>
						)}
						{client.phone && (
							<div className="flex items-center gap-2 text-sm">
								<Phone className="h-4 w-4 text-muted-foreground" />
								<span className="font-medium">Téléphone:</span>
								<span>{client.phone}</span>
							</div>
						)}
					</div>

					{client.website && (
						<div className="flex items-center gap-2 text-sm">
							<Globe className="h-4 w-4 text-muted-foreground" />
							<span className="font-medium">Site web:</span>
							<span className="truncate">{client.website}</span>
						</div>
					)}

					<div className="flex items-center gap-2 text-sm">
						<Calendar className="h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Créé le:</span>
						<span>{formatDate(client.createdAt)}</span>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-medium">
						Informations complémentaires
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div>
						<h4 className="text-sm font-medium mb-2">Informations fiscales</h4>
						<div className="grid grid-cols-2 gap-2">
							{client.siren && (
								<div className="flex items-center gap-2 text-sm">
									<Receipt className="h-4 w-4 text-muted-foreground" />
									<span className="font-medium">SIREN:</span>
									<span>{client.siren}</span>
								</div>
							)}
							{client.siret && (
								<div className="flex items-center gap-2 text-sm">
									<Receipt className="h-4 w-4 text-muted-foreground" />
									<span className="font-medium">SIRET:</span>
									<span>{client.siret}</span>
								</div>
							)}
							{client.vatNumber && (
								<div className="flex items-center gap-2 text-sm">
									<Receipt className="h-4 w-4 text-muted-foreground" />
									<span className="font-medium">TVA:</span>
									<span>{client.vatNumber}</span>
								</div>
							)}
							{!client.siren && !client.siret && !client.vatNumber && (
								<div className="col-span-2 text-sm text-muted-foreground italic">
									Aucune information fiscale renseignée
								</div>
							)}
						</div>
					</div>

					<div>
						<h4 className="text-sm font-medium mb-2">Adresse principale</h4>
						{defaultAddress ? (
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-sm">
									<MapPin className="h-4 w-4 text-muted-foreground" />
									<span>{defaultAddress.addressLine1}</span>
								</div>
								{defaultAddress.addressLine2 && (
									<div className="flex items-center gap-2 text-sm pl-6">
										<span>{defaultAddress.addressLine2}</span>
									</div>
								)}
								<div className="flex items-center gap-2 text-sm pl-6">
									<span>{`${defaultAddress.postalCode} ${defaultAddress.city}`}</span>
								</div>
								{defaultAddress.country && (
									<div className="flex items-center gap-2 text-sm pl-6">
										<span>{defaultAddress.country}</span>
									</div>
								)}
							</div>
						) : (
							<div className="text-sm text-muted-foreground italic">
								Aucune adresse renseignée
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
