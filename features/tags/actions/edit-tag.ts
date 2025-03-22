"use server";

import { auth } from "@/features/auth/lib/auth";
import db from "@/shared/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
} from "@/shared/types/server-action";
import { Tag } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import EditTagSchema from "../schemas/edit-tag-schema";

export default async function editTag(
	_: ServerActionState<Tag, typeof EditTagSchema> | null,
	formData: FormData
): Promise<ServerActionState<Tag, typeof EditTagSchema>> {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier un tag"
			);
		}

		// 2. Vérification de base des données requises
		const organizationId = formData.get("organizationId");
		const tagId = formData.get("id");

		if (!organizationId || !tagId) {
			return createErrorResponse(
				ServerActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation et l'ID du tag sont requis"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await db.member.findFirst({
			where: {
				userId: session.user.id,
				organizationId: organizationId.toString(),
			},
		});

		if (!hasAccess) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Validation complète des données
		const rawData = Object.fromEntries(formData.entries());
		const validation = EditTagSchema.safeParse(rawData);

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez corriger les erreurs ci-dessous"
			);
		}

		// 5. Vérification de l'existence du tag
		const existingTag = await db.tag.findFirst({
			where: {
				id: tagId.toString(),
				organizationId: organizationId.toString(),
			},
		});

		if (!existingTag) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"Tag introuvable"
			);
		}

		// 6. Vérification de l'unicité du nom
		const existingName = await db.tag.findFirst({
			where: {
				name: validation.data.name,
				organizationId: validation.data.organizationId,
				id: { not: tagId.toString() },
			},
			select: { id: true },
		});

		if (existingName) {
			return createErrorResponse(
				ServerActionStatus.CONFLICT,
				"Un tag avec ce nom existe déjà dans l'organisation"
			);
		}

		// 7. Mise à jour du tag
		const { organizationId: validatedOrgId, ...tagData } = validation.data;
		const tag = await db.tag.update({
			where: { id: tagId.toString() },
			data: tagData,
		});

		// Revalidation du cache
		revalidateTag(`tag:${tag.id}`);
		revalidateTag(`organization:${validatedOrgId}:tags`);

		return createSuccessResponse(tag, "Tag modifié avec succès");
	} catch (error) {
		console.error("[EDIT_TAG]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			error instanceof Error ? error.message : "Impossible de modifier le tag"
		);
	}
}
