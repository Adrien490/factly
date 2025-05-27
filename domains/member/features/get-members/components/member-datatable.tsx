import {
	Badge,
	Card,
	CardContent,
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
import Image from "next/image";
import { use } from "react";
import { GetMembersReturn } from "../types/index";
import { MemberActions } from "./member-actions";
import { MemberSelectionActions } from "./member-selection-actions";

export interface MemberDataTableProps {
	membersPromise: Promise<GetMembersReturn>;
	selectedMemberIds: string[];
}

export function MemberDataTable({
	membersPromise,
	selectedMemberIds,
}: MemberDataTableProps) {
	const response = use(membersPromise);
	const { members, pagination } = response;
	const memberIds = members.map((member) => member.id);

	if (members.length === 0) {
		return (
			<EmptyState
				title="Aucun membre trouvé"
				description="Aucun membre n'a été trouvé dans l'organisation."
				className="group-has-[[data-pending]]:animate-pulse py-12"
			/>
		);
	}

	return (
		<Card>
			<CardContent>
				<SelectionToolbar>
					<MemberSelectionActions selectedMemberIds={selectedMemberIds} />
				</SelectionToolbar>
				<Table className="group-has-[[data-pending]]:animate-pulse">
					<TableHeader>
						<TableRow>
							<TableHead key="select" role="columnheader">
								<SelectAllCheckbox itemIds={memberIds} />
							</TableHead>
							<TableHead key="user" role="columnheader">
								Utilisateur
							</TableHead>
							<TableHead
								key="email"
								role="columnheader"
								className="hidden md:table-cell"
							>
								Email
							</TableHead>
							<TableHead
								key="emailVerified"
								role="columnheader"
								className="hidden md:table-cell"
							>
								Email vérifié
							</TableHead>
							<TableHead
								key="joinedAt"
								role="columnheader"
								className="hidden lg:table-cell"
							>
								Membre depuis
							</TableHead>
							<TableHead key="actions" role="columnheader" className="">
								<></>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{members.map((member) => {
							return (
								<TableRow key={member.id} role="row" tabIndex={0}>
									<TableCell role="gridcell">
										<ItemCheckbox itemId={member.id} />
									</TableCell>
									<TableCell role="gridcell">
										<div className="w-[200px] flex flex-col space-y-1">
											<div className="flex items-center gap-2">
												{member.user.image && (
													<Image
														src={member.user.image}
														alt={member.user.name}
														className="w-8 h-8 rounded-full"
													/>
												)}
												<div className="font-medium truncate">
													{member.user.name}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell role="gridcell" className="hidden md:table-cell">
										<span className="text-sm">{member.user.email}</span>
									</TableCell>
									<TableCell role="gridcell" className="hidden md:table-cell">
										<Badge
											variant={
												member.user.emailVerified ? "default" : "secondary"
											}
										>
											{member.user.emailVerified ? "Vérifié" : "Non vérifié"}
										</Badge>
									</TableCell>
									<TableCell role="gridcell" className="hidden lg:table-cell">
										<span className="text-sm text-muted-foreground">
											{new Date(member.createdAt).toLocaleDateString("fr-FR", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</span>
									</TableCell>
									<TableCell role="gridcell">
										<MemberActions member={member} />
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell colSpan={6}>
								<Pagination
									page={pagination.page}
									pageCount={pagination.pageCount}
									total={pagination.total}
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
