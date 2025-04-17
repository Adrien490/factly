import {
	Badge,
	EmptyState,
	ItemCheckbox,
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
	BuildingIcon,
	CircleDot,
	MapPin,
	Receipt,
	Search,
	Tag,
} from "lucide-react";
import { use } from "react";

import { SelectionProvider } from "@/shared/contexts";
import { CLIENT_STATUSES, CLIENT_TYPES } from "../../constants";
import { ClientRowActions } from "./components";
import { ClientDataTableProps } from "./types";

export function ClientDataTable({ clientsPromise }: ClientDataTableProps) {
	const response = use(clientsPromise);
	const { clients, pagination } = response;
	const clientIds = clients.map((client) => client.id);

	console.log(clients);

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
	const columnCount = 7; // Le nombre total de colonnes dans le tableau

	return (
		<SelectionProvider>
			<SelectionToolbar />
			<Table className="group-has-[[data-pending]]:animate-pulse">
				<TableHeader>
					<TableRow>
						<TableHead key="select" role="columnheader">
							<div className="flex-1 font-medium">
								<SelectAllCheckbox itemIds={clientIds} />
							</div>
						</TableHead>
						<TableHead key="name" role="columnheader">
							<div className="flex-1 font-medium">Client</div>
						</TableHead>
						<TableHead
							key="clientType"
							role="columnheader"
							className="hidden md:table-cell"
						>
							<div className="flex-1 font-medium">Type</div>
						</TableHead>
						<TableHead
							key="status"
							role="columnheader"
							className="hidden md:table-cell"
						>
							<div className="flex-1 font-medium">Statut</div>
						</TableHead>
						<TableHead
							key="fiscalInfo"
							role="columnheader"
							className="hidden lg:table-cell"
						>
							<div className="flex-1 font-medium">Infos fiscales</div>
						</TableHead>
						<TableHead
							key="address"
							role="columnheader"
							className="hidden lg:table-cell"
						>
							<div className="flex-1 font-medium">Adresse</div>
						</TableHead>

						<TableHead key="actions" role="columnheader" className="">
							<div className="flex-1 font-medium"></div>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{clients.map((client) => (
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
								<div className="flex items-center gap-2">
									<BuildingIcon className="h-4 w-4 text-muted-foreground shrink-0" />
									<span>
										{
											CLIENT_TYPES.find(
												(option) => option.value === client.clientType
											)?.label
										}
									</span>
								</div>
							</TableCell>
							<TableCell role="gridcell" className="hidden md:table-cell">
								<div>
									{(() => {
										const statusOption = CLIENT_STATUSES.find(
											(option) => option.value === client.status
										);
										return (
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
										);
									})()}
								</div>
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
								<ClientRowActions client={client} />
							</TableCell>
						</TableRow>
					))}
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
