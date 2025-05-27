import { CreateMemberSheetForm } from "@/domains/member/features/create-member";
import { getMembers } from "@/domains/member/features/get-members";
import { RefreshMembersButton } from "@/domains/member/features/refresh-members";

import {
	MemberDataTable,
	MemberDataTableSkeleton,
} from "@/domains/member/features/get-members/components";
import {
	Button,
	PageContainer,
	PageHeader,
	SearchForm,
	SortingOptionsDropdown,
	Toolbar,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/components";
import { SortOrder } from "@/shared/types";
import { Suspense } from "react";

type PageProps = {
	searchParams: Promise<{
		selected?: string[];
		perPage?: string;
		page?: string;
		sortBy?: string;
		sortOrder?: SortOrder;
		search?: string;
		emailVerified?: string;
	}>;
};

export default async function MembersPage({ searchParams }: PageProps) {
	const { perPage, page, sortBy, sortOrder, search, emailVerified, selected } =
		await searchParams;

	const filters: Record<string, string | string[]> = {};
	const selectedMemberIds = !Array.isArray(selected)
		? selected
			? [selected]
			: []
		: (selected.filter(Boolean) as string[]);

	if (emailVerified) {
		filters.emailVerified = emailVerified;
	}

	return (
		<PageContainer className="group pb-12">
			<PageHeader
				title="Membres"
				description="Gérez les membres de votre organisation"
			/>

			<Toolbar>
				<SearchForm
					paramName="search"
					placeholder="Rechercher un membre..."
					className="flex-1 shrink-0"
				/>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<RefreshMembersButton />
						</TooltipTrigger>
						<TooltipContent>
							<p>Rafraîchir la liste des membres</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<SortingOptionsDropdown
					sortFields={[
						{
							label: "Date d'ajout",
							value: "createdAt",
						},
						{
							label: "Nom d'utilisateur",
							value: "user",
						},
					]}
					defaultSortBy="createdAt"
					defaultSortOrder="desc"
					className="w-[200px] shrink-0"
				/>

				<CreateMemberSheetForm>
					<Button className="shrink-0">Ajouter un membre</Button>
				</CreateMemberSheetForm>
			</Toolbar>

			<Suspense fallback={<MemberDataTableSkeleton />}>
				<MemberDataTable
					selectedMemberIds={selectedMemberIds}
					membersPromise={getMembers({
						perPage: Number(perPage) || 10,
						page: Number(page) || 1,
						sortBy: sortBy as "createdAt" | "user",
						sortOrder: sortOrder as SortOrder,
						search,
						filters,
					})}
				/>
			</Suspense>
		</PageContainer>
	);
}
