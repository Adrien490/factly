"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import db from "@/shared/lib/db";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import { Invitation, InvitationStatus } from "@prisma/client";
import { addDays } from "date-fns";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { createInvitationSchema } from "../schemas";

/**
 * Action serveur pour créer une nouvelle invitation
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - L'email ne doit pas déjà avoir une invitation en attente dans l'organisation
 */
export const createInvitation: ServerAction<
	Invitation,
	typeof createInvitationSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour envoyer une invitation"
			);
		}

		// 2. Vérification de base des données requises
		const organizationId = formData.get("organizationId");
		if (!organizationId) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation est requis"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId.toString());
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Préparation et transformation des données brutes
		const rawData = {
			organizationId: organizationId.toString(),
			email: formData.get("email") as string,
			userId: session.user.id,
			status: InvitationStatus.PENDING,
			expiresAt: formData.get("expiresAt")
				? new Date(formData.get("expiresAt") as string)
				: addDays(new Date(), 7), // Par défaut, expiration dans 7 jours
		};

		console.log("[CREATE_INVITATION] Raw data:", rawData);

		// 5. Validation des données avec le schéma Zod
		const validation = createInvitationSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[CREATE_INVITATION] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez remplir tous les champs obligatoires"
			);
		}

		// 6. Vérification de l'existence d'une invitation en attente pour cet email
		const existingInvitation = await db.invitation.findFirst({
			where: {
				email: validation.data.email,
				organizationId: validation.data.organizationId,
				status: InvitationStatus.PENDING,
			},
			select: { id: true },
		});

		if (existingInvitation) {
			return createErrorResponse(
				ActionStatus.CONFLICT,
				"Une invitation en attente existe déjà pour cette adresse email"
			);
		}

		// Vérification pour empêcher un utilisateur de s'inviter lui-même
		const currentUser = await db.user.findUnique({
			where: { id: session.user.id },
			select: { email: true },
		});

		if (currentUser && currentUser.email === validation.data.email) {
			return createErrorResponse(
				ActionStatus.CONFLICT,
				"Vous ne pouvez pas vous envoyer une invitation à vous-même"
			);
		}

		// Vérification si l'utilisateur est déjà membre de l'organisation
		const existingUser = await db.user.findUnique({
			where: { email: validation.data.email },
			select: { id: true },
		});

		if (existingUser) {
			const existingMember = await db.member.findUnique({
				where: {
					userId_organizationId: {
						userId: existingUser.id,
						organizationId: validation.data.organizationId,
					},
				},
			});

			if (existingMember) {
				return createErrorResponse(
					ActionStatus.CONFLICT,
					"Cette personne est déjà membre de l'organisation"
				);
			}
		}

		// 7. Création de l'invitation dans la base de données
		const invitation = await db.invitation.create({
			data: {
				email: validation.data.email,
				status: validation.data.status,
				expiresAt: validation.data.expiresAt,
				organization: {
					connect: { id: validation.data.organizationId },
				},
				user: {
					connect: { id: validation.data.userId },
				},
			},
		});

		// 8. Invalidation du cache pour forcer un rafraîchissement des données
		revalidateTag(`organization:${validation.data.organizationId}:invitations`);
		revalidateTag(
			`organization:${validation.data.organizationId}:invitations:count`
		);

		// TODO: Envoyer l'email d'invitation

		// 9. Retour de la réponse de succès
		return createSuccessResponse(
			invitation,
			`Invitation envoyée à ${invitation.email} avec succès`
		);
	} catch (error) {
		console.error("[CREATE_INVITATION]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible d'envoyer l'invitation"
		);
	}
};
