"use server";

import { auth } from "@/features/auth/lib/auth";
import db from "@/lib/db";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

// Schéma de validation pour l'ID d'invitation
const schema = z.string().cuid();

export async function acceptInvitation(invitationId: string) {
	try {
		// Validation
		const validatedId = schema.parse(invitationId);

		// Authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Non authentifié");
		}

		// Vérification que l'invitation existe et est en attente
		const invitation = await db.invitation.findFirst({
			where: {
				id: validatedId,
				email: session.user.email,
				status: "PENDING",
			},
		});

		if (!invitation) {
			throw new Error("Invitation non trouvée ou déjà traitée");
		}

		// Vérification que l'utilisateur n'est pas déjà membre de l'organisation
		const existingMembership = await db.member.findFirst({
			where: {
				userId: session.user.id,
				organizationId: invitation.organizationId,
			},
		});

		if (existingMembership) {
			// Mise à jour de l'invitation seulement
			await db.invitation.update({
				where: { id: invitation.id },
				data: { status: "ACCEPTED" },
			});

			// Invalidation du cache
			revalidateTag(`invitations:user:${session.user.email}`);
			return { success: true };
		}

		// Transaction pour accepter l'invitation et créer l'adhésion
		await db.$transaction([
			// Mettre à jour l'invitation
			db.invitation.update({
				where: { id: invitation.id },
				data: { status: "ACCEPTED" },
			}),
			// Créer l'adhésion à l'organisation
			db.member.create({
				data: {
					userId: session.user.id,
					organizationId: invitation.organizationId,
				},
			}),
		]);

		// Invalidation du cache
		revalidateTag(`invitations:user:${session.user.email}`);
		revalidateTag(`organizations:user:${session.user.id}`);

		return { success: true };
	} catch (error) {
		console.error("Erreur lors de l'acceptation de l'invitation:", error);
		throw new Error("Impossible d'accepter l'invitation");
	}
}
