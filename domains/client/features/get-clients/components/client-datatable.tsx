import {
	Badge,
	Card,
	CardContent,
	EmptyState,
	ItemCheckbox,
	Pagination,
	SelectAllCheckbox,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components";
import { MapPin, Tag } from "lucide-react";
import { use } from "react";

import {
	CLIENT_STATUS_COLORS,
	CLIENT_STATUS_LABELS,
} from "@/domains/client/constants/client-statuses";
import {
	CLIENT_TYPE_COLORS,
	CLIENT_TYPE_LABELS,
} from "@/domains/client/constants/client-types";
import { ClientStatus } from "@prisma/client";
import { ArchivedClientActions } from "../../../components/archived-client-actions";
import { ClientActions } from "../../../components/client-actions";
import { GetClientsReturn } from "../types/index";

export interface ClientDataTableProps {
	clientsPromise: Promise<GetClientsReturn>;
}

export function ClientDataTable({ clientsPromise }: ClientDataTableProps) {
	const response = use(clientsPromise);
	const { clients, pagination } = response;
	const clientIds = clients.map((client) => client.id);

	if (clients.length === 0) {
		return (
			<EmptyState
				title="Aucun client trouvé"
				description="Aucun client n'a été trouvé. Vous pouvez en créer un nouveau."
				className="group-has-[[data-pending]]:animate-pulse py-12"
			/>
		);
	}

	return (
		<Card>
			<CardContent>
				<Table className="group-has-[[data-pending]]:animate-pulse">
					<TableHeader>
						<TableRow>
							<TableHead key="select" role="columnheader">
								<SelectAllCheckbox itemIds={clientIds} />
							</TableHead>
							<TableHead key="name" role="columnheader">
								Client
							</TableHead>
							<TableHead
								key="reference"
								role="columnheader"
								className="hidden md:table-cell"
							>
								Référence
							</TableHead>
							<TableHead
								key="clientType"
								role="columnheader"
								className="hidden md:table-cell"
							>
								Type
							</TableHead>
							<TableHead
								key="status"
								role="columnheader"
								className="hidden md:table-cell"
							>
								Statut
							</TableHead>
							<TableHead
								key="address"
								role="columnheader"
								className="hidden lg:table-cell"
							>
								Adresse
							</TableHead>

							<TableHead key="actions" role="columnheader" className="">
								<></>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{clients.map((client) => {
							const isArchived = client.status === ClientStatus.ARCHIVED;

							return (
								<TableRow key={client.id} role="row" tabIndex={0}>
									<TableCell role="gridcell">
										<ItemCheckbox itemId={client.id} />
									</TableCell>
									<TableCell role="gridcell">
										<div className="w-[200px] flex flex-col space-y-1">
											<div className="flex items-center gap-2">
												<div className="font-medium truncate">
													{client.clientType === "COMPANY" ? (
														client.company?.companyName
													) : (
														<>
															{client.contacts[0]?.civility && (
																<span className="text-muted-foreground">
																	{client.contacts[0].civility}{" "}
																</span>
															)}
															{client.contacts[0]?.lastName}{" "}
															{client.contacts[0]?.firstName}
														</>
													)}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell role="gridcell" className="hidden md:table-cell">
										{client.reference ? (
											<div className="flex items-center gap-1.5 text-sm">
												<Tag className="h-3 w-3 shrink-0 text-muted-foreground" />
												<span className="truncate">{client.reference}</span>
											</div>
										) : (
											<span className="text-sm text-muted-foreground italic">
												Non renseignée
											</span>
										)}
									</TableCell>
									<TableCell role="gridcell" className="hidden md:table-cell">
										<Badge
											variant="outline"
											style={{
												backgroundColor: `${
													CLIENT_TYPE_COLORS[client.clientType]
												}20`, // Couleur avec opacity 20%
												color: CLIENT_TYPE_COLORS[client.clientType],
												borderColor: `${
													CLIENT_TYPE_COLORS[client.clientType]
												}40`, // Couleur avec opacity 40%
											}}
										>
											{CLIENT_TYPE_LABELS[client.clientType]}
										</Badge>
									</TableCell>
									<TableCell role="gridcell" className="hidden md:table-cell">
										<Badge
											variant="outline"
											style={{
												backgroundColor: `${
													CLIENT_STATUS_COLORS[client.status]
												}20`, // Couleur avec opacity 20%
												color: CLIENT_STATUS_COLORS[client.status],
												borderColor: `${CLIENT_STATUS_COLORS[client.status]}40`, // Couleur avec opacity 40%
											}}
										>
											{CLIENT_STATUS_LABELS[client.status]}
										</Badge>
									</TableCell>
									<TableCell role="gridcell" className="hidden lg:table-cell">
										<div className="flex flex-col space-y-2 max-w-[250px] text-sm">
											{client.addresses && client.addresses.length > 0 ? (
												<>
													{client.addresses.map((addr) => (
														<div
															key={addr.id}
															className="flex items-start gap-2"
														>
															<MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
															<div className="flex flex-col">
																<span className="text-xs font-medium">
																	{addr.addressType === "BILLING"
																		? "Facturation"
																		: addr.addressType === "SHIPPING"
																			? "Livraison"
																			: "Autre"}
																</span>
																<span className="truncate text-muted-foreground">
																	{[
																		addr.addressLine1,
																		addr.postalCode,
																		addr.city,
																	]
																		.filter(Boolean)
																		.join(", ")}
																</span>
															</div>
														</div>
													))}
												</>
											) : (
												<div className="flex items-center gap-2">
													<MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
													<span className="text-muted-foreground italic">
														Non renseignée
													</span>
												</div>
											)}
										</div>
									</TableCell>
									<TableCell role="gridcell" className="flex justify-end">
										{isArchived ? (
											<ArchivedClientActions client={client} />
										) : (
											<ClientActions client={client} />
										)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell colSpan={7} className="px-4 py-2 hover:bg-transparent">
								<Pagination
									total={pagination.total}
									pageCount={pagination.pageCount}
									page={pagination.page}
									perPage={pagination.perPage}
								/>
							</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</CardContent>
		</Card>
	);
}
