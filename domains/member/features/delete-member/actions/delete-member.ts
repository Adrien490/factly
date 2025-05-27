"use server";

import { auth } from "@/domains/auth";
import { checkMembership } from "@/domains/member/features/check-membership";
import db from "@/shared/lib/db";

import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import { Member } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { deleteMemberSchema } from "../schemas";

export const deleteMember: ServerAction<
	Member,
	typeof deleteMemberSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour effectuer cette action"
			);
		}

		// 2. Vérification de l'appartenance
		const membership = await checkMembership({
			userId: session.user.id,
		});

		if (!membership.isMember) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être membre pour effectuer cette action"
			);
		}

		console.log(formData);

		// 3. Récupération des données
		const rawData = {
			id: formData.get("id") as string,
		};

		console.log("[DELETE_MEMBER] Form Data:", {
			id: rawData.id,
		});

		// 3. Validation complète des données
		const validation = deleteMemberSchema.safeParse(rawData);

		if (!validation.success) {
			console.log(validation.error.flatten().fieldErrors);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre saisie."
			);
		}

		// 4. Vérification de l'existence du membre
		const existingMember = await db.member.findFirst({
			where: {
				id: validation.data.id,
			},
			include: {
				user: {
					select: {
						name: true,
						email: true,
					},
				},
			},
		});

		if (!existingMember) {
			return createErrorResponse(ActionStatus.NOT_FOUND, "Membre introuvable");
		}

		// 5. Vérification que l'utilisateur ne se supprime pas lui-même
		if (existingMember.userId === session.user.id) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous ne pouvez pas vous supprimer vous-même"
			);
		}

		// 6. Suppression
		await db.member.delete({
			where: { id: validation.data.id },
		});

		// Revalidation du cache avec les mêmes tags que get-members
		revalidateTag(`members`);
		revalidateTag(`members:count`);
		revalidateTag(`membership:${existingMember.userId}`);

		return createSuccessResponse(
			existingMember,
			`Membre "${existingMember.user.name}" retiré de l'organisation`
		);
	} catch (error) {
		console.error("[DELETE_MEMBER]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Impossible de retirer le membre de l'organisation"
		);
	}
};
