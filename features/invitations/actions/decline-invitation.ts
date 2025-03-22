"use server";

import { auth } from "@/features/auth/lib/auth";
import db from "@/shared/lib/db";
import { headers } from "next/headers";
import { z } from "zod";

// Schéma de validation pour l'ID d'invitation
const schema = z.string().cuid();

export async function declineInvitation(invitationId: string) {
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

		// Mise à jour du statut de l'invitation
		await db.invitation.update({
			where: { id: invitation.id },
			data: { status: "REJECTED" },
		});

		return { success: true };
	} catch (error) {
		console.error("Erreur lors du refus de l'invitation:", error);
		throw new Error("Impossible de refuser l'invitation");
	}
}
