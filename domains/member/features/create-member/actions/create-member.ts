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
import { createMemberSchema } from "../schemas/create-member-schema";

/**
 * Action serveur pour créer un nouveau membre
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit être membre pour ajouter d'autres membres
 * - L'email doit correspondre à un utilisateur existant
 * - L'utilisateur ne doit pas déjà être membre
 */
export const createMember: ServerAction<
	Member,
	typeof createMemberSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour ajouter un membre"
			);
		}

		// 2. Vérification de l'appartenance
		const membership = await checkMembership({
			userId: session.user.id,
		});

		if (!membership.isMember) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être membre pour ajouter d'autres membres"
			);
		}

		// 3. Préparation et transformation des données brutes
		const rawData = {
			email: formData.get("email") as string,
		};

		console.log("[CREATE_MEMBER] Raw data:", rawData);

		// 4. Validation des données avec le schéma Zod
		const validation = createMemberSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[CREATE_MEMBER] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Veuillez remplir tous les champs obligatoires",
				rawData
			);
		}

		const { email } = validation.data;

		// 5. Vérification que l'utilisateur existe
		const user = await db.user.findUnique({
			where: { email },
			select: { id: true, name: true, email: true },
		});

		if (!user) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Aucun utilisateur trouvé avec cet email"
			);
		}

		// 6. Vérification que l'utilisateur n'est pas déjà membre
		const existingMember = await db.member.findUnique({
			where: { userId: user.id },
			select: { id: true },
		});

		if (existingMember) {
			return createErrorResponse(
				ActionStatus.CONFLICT,
				"Cet utilisateur est déjà membre"
			);
		}

		// 7. Création du membre dans la base de données
		const member = await db.member.create({
			data: {
				userId: user.id,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						emailVerified: true,
						createdAt: true,
					},
				},
			},
		});

		// 8. Invalidation du cache
		revalidateTag(`members`);
		revalidateTag(`members:count`);
		revalidateTag(`membership:${user.id}`);
		revalidateTag(`membership`);

		// 9. Retour de la réponse de succès
		return createSuccessResponse(
			member,
			`${user.name || user.email} a été ajouté comme membre avec succès`,
			rawData
		);
	} catch (error) {
		console.error("[CREATE_MEMBER]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error ? error.message : "Impossible de créer le membre"
		);
	}
};
