"use server";

import { auth } from "@/features/auth/lib/auth";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";

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

export type GetInvitationReturn = Prisma.InvitationGetPayload<{
	select: typeof DEFAULT_SELECT;
}>;

export async function getInvitation(
	id: string
): Promise<GetInvitationReturn | null> {
	try {
		// Vérification de la session
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Vous devez être connecté pour accéder à cette page");
		}

		const getData = async () => {
			const invitation = await db.invitation.findFirst({
				where: {
					id,
					email: session.user.email,
				},
				select: DEFAULT_SELECT,
			});

			return invitation;
		};

		return await getData();
	} catch (error) {
		console.error("[GET_INVITATION_ERROR]", { id, error });
		throw error instanceof Error
			? error
			: new Error("Erreur lors de la récupération de l'invitation");
	}
}
