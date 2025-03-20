"use server";

import { auth } from "@/features/auth/lib/auth";
import db from "@/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/types/server-action";
import { Invitation } from "@prisma/client";
import { headers } from "next/headers";
import invitationFormSchema from "../schemas/send-invitation-schema";

export default async function sendInvitation(
	_: ServerActionState<Invitation, typeof invitationFormSchema> | null,
	formData: FormData
): Promise<ServerActionState<Invitation, typeof invitationFormSchema>> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour envoyer une invitation"
			);
		}

		const rawData = {
			email: formData.get("email")?.toString() || "",
			message: formData.get("message")?.toString() || "",
			status: formData.get("status")?.toString() || "PENDING",
			organizationId: formData.get("organizationId")?.toString() || "",
		};

		console.log("Raw data:", rawData);

		const validation = invitationFormSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs ci-dessous"
			);
		}

		// Vérifier que l'utilisateur est bien membre de l'organisation
		const isMember = await db.member.findFirst({
			where: {
				userId: session.user.id,
				organizationId: validation.data.organizationId,
			},
		});

		if (!isMember) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'êtes pas autorisé à envoyer des invitations pour cette organisation"
			);
		}

		// Vérifier si l'invitation existe déjà
		const existingInvitation = await db.invitation.findFirst({
			where: {
				email: validation.data.email,
				organizationId: validation.data.organizationId,
			},
		});

		if (existingInvitation) {
			return createErrorResponse(
				ServerActionStatus.CONFLICT,
				"Une invitation a déjà été envoyée à cette adresse email"
			);
		}

		// Création de l'invitation
		const invitation = await db.invitation.create({
			data: {
				email: validation.data.email,
				status: validation.data.status,
				organizationId: validation.data.organizationId,
				// Ajoutez ici d'autres champs si nécessaire
			},
		});

		return createSuccessResponse(
			invitation,
			`L'invitation a été envoyée à ${invitation.email} avec succès`
		);
	} catch (error) {
		console.error("[SEND_INVITATION]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible d'envoyer l'invitation"
		);
	}
}
