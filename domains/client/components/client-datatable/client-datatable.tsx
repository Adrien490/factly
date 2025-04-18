import {
	Badge,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	EmptyState,
	ItemCheckbox,
	LoadingIndicator,
	Pagination,
	SelectAllCheckbox,
	SelectionToolbar,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components";
import {
	CircleDot,
	Edit2,
	FileText,
	MapPin,
	MoreVerticalIcon,
	Receipt,
	Search,
	Tag,
	Users,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

import { SelectionProvider } from "@/shared/contexts";
import { cn } from "@/shared/utils";
import { CLIENT_STATUSES, CLIENT_TYPES } from "../../constants";
import { DeleteClientAlertDialogForm } from "../../features/delete-client/components/delete-client-alert-dialog-form";
import { ClientDataTableProps } from "./types";

export function ClientDataTable({ clientsPromise }: ClientDataTableProps) {
	const response = use(clientsPromise);
	const { clients, pagination } = response;
	const clientIds = clients.map((client) => client.id);

	if (clients.length === 0) {
		return (
			<div className="py-12" role="status" aria-live="polite">
				<EmptyState
					icon={<Search className="w-10 h-10" />}
					title="Aucune donnée trouvée"
					description="Aucune donnée ne correspond à vos critères de recherche."
					className="group-has-[[data-pending]]:animate-pulse"
				/>
			</div>
		);
	}

	// Calculer le nombre de colonnes pour le colSpan
	const columnCount = 7;

	// Le nombre total de colonnes dans le tableau

	return (
		<SelectionProvider>
			<SelectionToolbar />
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
							key="fiscalInfo"
							role="columnheader"
							className="hidden lg:table-cell"
						>
							Infos fiscales
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
						const statusOption = CLIENT_STATUSES.find(
							(option) => option.value === client.status
						);
						const clientTypeOption = CLIENT_TYPES.find(
							(option) => option.value === client.clientType
						);
						return (
							<TableRow key={client.id} role="row" tabIndex={0}>
								<TableCell role="gridcell">
									<ItemCheckbox itemId={client.id} />
								</TableCell>
								<TableCell role="gridcell">
									<div className="w-[200px] flex flex-col space-y-1">
										<div className="flex items-center gap-2">
											<div className="font-medium truncate">{client.name}</div>
										</div>
										{client.reference && (
											<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
												<Tag className="h-3 w-3 shrink-0" />
												<span>{client.reference}</span>
											</div>
										)}
									</div>
								</TableCell>
								<TableCell role="gridcell" className="hidden md:table-cell">
									<Badge
										variant="outline"
										style={{
											backgroundColor: `${clientTypeOption?.color}20`, // Couleur avec opacity 20%
											color: clientTypeOption?.color,
											borderColor: `${clientTypeOption?.color}40`, // Couleur avec opacity 40%
										}}
									>
										{clientTypeOption?.label}
									</Badge>
								</TableCell>
								<TableCell role="gridcell" className="hidden md:table-cell">
									<Badge
										variant="outline"
										style={{
											backgroundColor: `${statusOption?.color}20`, // Couleur avec opacity 20%
											color: statusOption?.color,
											borderColor: `${statusOption?.color}40`, // Couleur avec opacity 40%
										}}
									>
										{statusOption?.label || client.status}
									</Badge>
								</TableCell>
								<TableCell role="gridcell" className="hidden lg:table-cell">
									<div className="flex flex-col space-y-1 max-w-[150px]">
										{client.siret && (
											<div className="flex items-center gap-1.5 text-xs">
												<Receipt className="h-3 w-3 shrink-0 text-muted-foreground" />
												<span className="truncate">{client.siret}</span>
											</div>
										)}
										{client.vatNumber && (
											<div className="flex items-center gap-1.5 text-xs">
												<CircleDot className="h-3 w-3 shrink-0 text-muted-foreground" />
												<span className="truncate">{client.vatNumber}</span>
											</div>
										)}
										{!client.siret && !client.vatNumber && (
											<span className="text-xs text-muted-foreground italic">
												Non renseignées
											</span>
										)}
									</div>
								</TableCell>
								<TableCell role="gridcell" className="hidden lg:table-cell">
									<div className="flex items-center gap-2 max-w-[200px]">
										<MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
										{client.addresses?.find((addr) => addr.isDefault) ? (
											<span className="truncate">
												{[
													client.addresses.find((addr) => addr.isDefault)
														?.addressLine1,
													client.addresses.find((addr) => addr.isDefault)
														?.postalCode,
													client.addresses.find((addr) => addr.isDefault)?.city,
												]
													.filter(Boolean)
													.join(", ")}
											</span>
										) : (
											<span className="text-muted-foreground italic">
												Non renseignée
											</span>
										)}
									</div>
								</TableCell>
								<TableCell role="gridcell" className="">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className={cn(
													"h-8 w-8 rounded-full hover:bg-muted focus-visible:bg-muted"
												)}
												aria-label="Menu d'actions"
												type="button"
											>
												<MoreVerticalIcon className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											side="bottom"
											sideOffset={4}
											className="w-48"
										>
											<DropdownMenuItem asChild>
												<Link
													href={`/dashboard/${client.organizationId}/clients/${client.id}`}
													className={cn("flex w-full items-center")}
												>
													<FileText className="h-4 w-4 mr-2" />
													<span>Fiche client</span>
													{/* Indicateur de chargement masqué par défaut */}
													<LoadingIndicator className="ml-auto h-4 w-4 invisible" />
												</Link>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem asChild>
												<Link
													href={`/dashboard/${client.organizationId}/clients/${client.id}/edit`}
													className={cn("flex w-full items-center")}
												>
													<Edit2 className="h-4 w-4 mr-2" />
													<span>Modifier</span>
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link
													href={`/dashboard/${client.organizationId}/clients/${client.id}/contacts`}
													className={cn("flex w-full items-center")}
												>
													<Users className="h-4 w-4 mr-2" />
													<span>Contacts</span>
												</Link>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DeleteClientAlertDialogForm client={client} />
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell
							colSpan={columnCount}
							className="px-4 py-2 hover:bg-transparent"
						>
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
		</SelectionProvider>
	);
}
