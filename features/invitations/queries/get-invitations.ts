"use server";

import { auth } from "@/features/auth/lib/auth";
import db from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { InvitationSortableField } from "../lib/invitation-sortable-fields";
import GetInvitationsSchema, {
	GetInvitationsParams,
} from "../schemas/get-invitations-schema";

// Types
const DEFAULT_SELECT = {
	id: true,
	email: true,
	status: true,
	organizationId: true,
	createdAt: true,
	updatedAt: true,
	organization: {
		select: {
			id: true,
			name: true,
			logoUrl: true,
		},
	},
} satisfies Prisma.InvitationSelect;

export type GetInvitationsReturn = Array<
	Prisma.InvitationGetPayload<{ select: typeof DEFAULT_SELECT }>
>;

// Helpers
const buildWhereClause = (
	params: GetInvitationsParams,
	email: string
): Prisma.InvitationWhereInput => {
	const baseWhere: Prisma.InvitationWhereInput = {
		email,
	};

	if (params.status) {
		baseWhere.status = params.status;
	}

	if (!params.search) {
		return baseWhere;
	}

	const searchTerm = params.search.trim().toLowerCase();
	return {
		AND: [
			baseWhere,
			{
				organization: {
					name: { contains: searchTerm, mode: "insensitive" },
				},
			},
		],
	};
};

// Helper function to build orderBy clause
const buildOrderByClause = (
	sortBy?: InvitationSortableField | "organization.name",
	sortOrder?: "asc" | "desc"
): Prisma.InvitationOrderByWithRelationInput[] => {
	if (!sortBy || !sortOrder) {
		return [{ createdAt: "desc" }, { id: "desc" }];
	}

	// Handle nested sorting (organization.name)
	if (sortBy === "organization.name") {
		return [
			{
				organization: {
					name: sortOrder,
				},
			},
			{ id: sortOrder },
		];
	}

	// Handle regular field sorting
	return [{ [sortBy]: sortOrder }, { id: sortOrder }];
};

// Helper function to fetch invitations
async function fetchInvitations(
	params: GetInvitationsParams,
	email: string
): Promise<GetInvitationsReturn> {
	try {
		// Validate parameters
		const validation = GetInvitationsSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;
		const where = buildWhereClause(validatedParams, email);
		const orderBy = buildOrderByClause(
			validatedParams.sortBy,
			validatedParams.sortOrder
		);

		// Get data directly without timeout
		const invitations = await db.invitation.findMany({
			where,
			select: DEFAULT_SELECT,
			orderBy,
		});

		return invitations;
	} catch (error) {
		console.error("[FETCH_INVITATIONS]", error);
		return [];
	}
}

// Main function to get invitations
export default async function getInvitations(
	params: GetInvitationsParams
): Promise<GetInvitationsReturn> {
	try {
		// Verify authentication
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session) {
			throw new Error("Unauthorized");
		}

		// Call the cacheable function
		return fetchInvitations(params, session.user.email);
	} catch (error) {
		console.error("[GET_INVITATIONS]", error);
		return [];
	}
}
