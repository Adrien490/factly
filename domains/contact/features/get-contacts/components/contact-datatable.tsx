import { ContactActions } from "@/domains/contact/components/contact-actions";
import {
	Badge,
	Card,
	CardContent,
	EmptyState,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components";
import { use } from "react";
import { GetContactsReturn } from "../types";

interface ContactDataTableProps {
	contactsPromise: Promise<GetContactsReturn>;
}

export function ContactDataTable({ contactsPromise }: ContactDataTableProps) {
	const contacts = use(contactsPromise);

	if (contacts.length === 0) {
		return (
			<EmptyState
				description="Aucun contact trouvé"
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
							<TableHead
								key="name"
								role="columnheader"
								className="min-w-[300px] max-w-[300px]"
							>
								Contact
							</TableHead>
							<TableHead
								key="mobile"
								role="columnheader"
								className="hidden md:table-cell min-w-[150px] max-w-[150px]"
							>
								Mobile
							</TableHead>
							<TableHead
								key="fax"
								role="columnheader"
								className="hidden lg:table-cell min-w-[150px] max-w-[150px]"
							>
								Fax
							</TableHead>
							<TableHead
								key="website"
								role="columnheader"
								className="hidden xl:table-cell min-w-[200px] max-w-[200px]"
							>
								Site web
							</TableHead>
							<TableHead
								key="status"
								role="columnheader"
								className="hidden lg:table-cell min-w-[100px] max-w-[100px]"
							>
								Statut
							</TableHead>
							<TableHead
								key="actions"
								role="columnheader"
								className="min-w-[50px] max-w-[50px]"
							>
								<></>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{contacts.map((contact) => (
							<TableRow key={contact.id} role="row" tabIndex={0}>
								<TableCell
									role="gridcell"
									className="min-w-[300px] max-w-[300px]"
								>
									<div className="flex flex-col space-y-1">
										<div className="flex items-center gap-2">
											<div className="font-medium truncate">
												{contact.civility && (
													<span className="text-muted-foreground">
														{contact.civility}{" "}
													</span>
												)}
												{contact.lastName} {contact.firstName}
												{contact.isDefault && (
													<Badge className="ml-2">Par défaut</Badge>
												)}
											</div>
										</div>
										{contact.function && (
											<span className="text-sm text-muted-foreground truncate">
												{contact.function}
											</span>
										)}
										{contact.email && (
											<a
												href={`mailto:${contact.email}`}
												className="text-sm text-muted-foreground hover:underline truncate"
											>
												{contact.email}
											</a>
										)}
										{contact.phoneNumber && (
											<a
												href={`tel:${contact.phoneNumber}`}
												className="text-sm text-muted-foreground hover:underline truncate"
											>
												{contact.phoneNumber}
											</a>
										)}
									</div>
								</TableCell>
								<TableCell
									role="gridcell"
									className="hidden md:table-cell min-w-[150px] max-w-[150px]"
								>
									{contact.mobileNumber ? (
										<a
											href={`tel:${contact.mobileNumber}`}
											className="text-sm hover:underline truncate"
										>
											{contact.mobileNumber}
										</a>
									) : (
										<span className="text-sm text-muted-foreground italic">
											Non renseigné
										</span>
									)}
								</TableCell>
								<TableCell
									role="gridcell"
									className="hidden lg:table-cell min-w-[150px] max-w-[150px]"
								>
									{contact.faxNumber ? (
										<a
											href={`tel:${contact.faxNumber}`}
											className="text-sm hover:underline truncate"
										>
											{contact.faxNumber}
										</a>
									) : (
										<span className="text-sm text-muted-foreground italic">
											Non renseigné
										</span>
									)}
								</TableCell>
								<TableCell
									role="gridcell"
									className="hidden xl:table-cell min-w-[200px] max-w-[200px]"
								>
									{contact.website ? (
										<a
											href={contact.website}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm hover:underline truncate"
										>
											{contact.website.replace(/^https?:\/\/(www\.)?/, "")}
										</a>
									) : (
										<span className="text-sm text-muted-foreground italic">
											Non renseigné
										</span>
									)}
								</TableCell>
								<TableCell
									role="gridcell"
									className="hidden lg:table-cell min-w-[100px] max-w-[100px]"
								>
									{contact.isDefault ? (
										<Badge variant="default">Principal</Badge>
									) : (
										<Badge variant="secondary">Secondaire</Badge>
									)}
								</TableCell>
								<TableCell
									role="gridcell"
									className="min-w-[50px] max-w-[50px]"
								>
									<ContactActions contact={contact} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
