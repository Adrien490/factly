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
							<TableHead key="name" role="columnheader" className="w-[400px]">
								Contact
							</TableHead>
							<TableHead
								key="mobile"
								role="columnheader"
								className="hidden md:table-cell w-[150px]"
							>
								Mobile
							</TableHead>
							<TableHead
								key="website"
								role="columnheader"
								className="hidden xl:table-cell w-[200px]"
							>
								Site web
							</TableHead>
							<TableHead key="actions" role="columnheader" className="w-12">
								<></>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{contacts.map((contact) => (
							<TableRow key={contact.id} role="row" tabIndex={0}>
								<TableCell role="gridcell" className="w-[400px]">
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
											<span className="text-sm text-muted-foreground">
												{contact.function}
											</span>
										)}
										{contact.email && (
											<a
												href={`mailto:${contact.email}`}
												className="text-sm text-muted-foreground hover:underline"
											>
												{contact.email}
											</a>
										)}
										{contact.phoneNumber && (
											<a
												href={`tel:${contact.phoneNumber}`}
												className="text-sm text-muted-foreground hover:underline"
											>
												{contact.phoneNumber}
											</a>
										)}
									</div>
								</TableCell>
								<TableCell
									role="gridcell"
									className="hidden md:table-cell w-[150px]"
								>
									{contact.mobileNumber ? (
										<a
											href={`tel:${contact.mobileNumber}`}
											className="text-sm hover:underline"
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
									className="hidden xl:table-cell w-[200px]"
								>
									{contact.website ? (
										<a
											href={contact.website}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm hover:underline"
										>
											{contact.website.replace(/^https?:\/\/(www\.)?/, "")}
										</a>
									) : (
										<span className="text-sm text-muted-foreground italic">
											Non renseigné
										</span>
									)}
								</TableCell>
								<TableCell role="gridcell" className="flex justify-end w-12">
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
